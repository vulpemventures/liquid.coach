import {
  Psbt,
  confidential,
  address,
  payments,
  Network,
  Transaction,
} from 'liquidjs-lib';
import { toAssetHash } from '../helpers';

const fetch = window.fetch;

export const EXPLORER_URL = {
  liquid: 'https://blockstream.info/liquid/api',
  regtest: 'https://nigiri.network/liquid/api',
};

interface UtxoInterface {
  txid: string;
  vout: number;
  asset: string;
  value: number;
}

export default class LiquidWallet {
  scriptPubKey: string;
  address: string;
  network: Network;

  constructor(identity: string, network: Network) {
    try {
      address.toOutputScript(identity, network);
    } catch (ignore) {
      throw new Error('Invalid address');
    }

    const payment = payments.p2wpkh({ address: identity, network });
    this.scriptPubKey = payment.output!.toString('hex');
    this.address = payment.address!;
    this.network = network;
  }

  static createTx(): string {
    const psbt = new Psbt();
    return psbt.toBase64();
  }

  decodeTx(psbtBase64: string): any {
    let psbt: Psbt;
    try {
      psbt = Psbt.fromBase64(psbtBase64);
    } catch (ignore) {
      throw new Error('Invalid psbt');
    }

    const bufferTx: Buffer = psbt.data.globalMap.unsignedTx.toBuffer();
    const transaction: Transaction = Transaction.fromBuffer(bufferTx);

    let inputs: Array<any> = [],
      outputs: Array<any> = [];

    psbt.data.inputs.forEach((i, index) => {
      const txid = transaction.ins[index].hash.reverse().toString('hex');
      const vout = transaction.ins[index].index;
      const value = confidential.confidentialValueToSatoshi(
        i.witnessUtxo?.value!
      );
      const asset = toAssetHash(i.witnessUtxo?.asset!);

      inputs.push({
        txid,
        vout,
        value,
        asset,
      });
    });

    transaction.outs.forEach(o => {
      const asset = toAssetHash(o.asset);
      const value = confidential.confidentialValueToSatoshi(o.value);
      const addr = address.fromOutputScript(o.script, this.network);

      outputs.push({
        asset,
        value,
        address: addr,
      });
    });

    return {
      inputs,
      outputs,
    };
  }

  updateTx(
    psbtBase64: string,
    inputs: Array<any>,
    outputs: Array<any>
  ): string {
    let psbt: Psbt;
    try {
      psbt = Psbt.fromBase64(psbtBase64);
    } catch (ignore) {
      throw new Error('Invalid psbt');
    }

    inputs.forEach((i: UtxoInterface) =>
      psbt.addInput({
        hash: i.txid,
        index: i.vout,
        witnessUtxo: {
          script: Buffer.from(this.scriptPubKey, 'hex'),
          asset: Buffer.concat([
            Buffer.from('01', 'hex'), //prefix for unconfidential asset
            Buffer.from(i.asset, 'hex').reverse(),
          ]),
          value: confidential.satoshiToConfidentialValue(Number(i.value)),
          nonce: Buffer.from('00', 'hex'),
        },
      } as any)
    );

    outputs.forEach(o => {
      const script = address.toOutputScript(o.address, this.network);
      psbt.addOutput({
        script: script,
        asset: Buffer.concat([
          Buffer.from('01', 'hex'), //prefix for unconfidential asset
          Buffer.from(o.asset, 'hex').reverse(),
        ]),
        value: confidential.satoshiToConfidentialValue(Number(o.value)),
        nonce: Buffer.from('00', 'hex'),
      } as any);
    });

    return psbt.toBase64();
  }
}

export function fetchUtxos(address: string, url: string): Promise<any> {
  return fetch(`${url}/address/${address}/utxo`).then(r => r.json());
}

export async function fetchBalances(
  address: string,
  url: string
): Promise<any> {
  const fetchedData = await fetchUtxos(address, url);
  const balances = fetchedData.reduce(
    (storage: { [x: string]: any }, item: { [x: string]: any; value: any }) => {
      // get the first instance of the key by which we're grouping
      var group = item['asset'];

      // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
      storage[group] = storage[group] || 0;

      // add this item to its group within `storage`
      storage[group] += item.value;

      // return the updated storage to the reduce function, which will then loop through the next
      return storage;
    },
    {}
  ); // {} is the initial value of the storage

  const utxos = fetchedData.reduce(
    (storage: { [x: string]: any }, item: { [x: string]: any; value: any }) => {
      // get the first instance of the key by which we're grouping
      var group = item['asset'];

      // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
      storage[group] = storage[group] || [];

      // add this item to its group within `storage`
      storage[group].push(item);

      // return the updated storage to the reduce function, which will then loop through the next
      return storage;
    },
    {}
  ); // {} is the initial value of the storage

  return {
    balances,
    utxos,
  };
}
