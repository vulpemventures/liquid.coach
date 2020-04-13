import { Psbt, confidential, address, payments, Network } from 'liquidjs-lib';

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

  constructor(identity: string, network: Network) {
    try {
      address.toOutputScript(identity, network);
    } catch (ignore) {
      throw new Error('Invalid address');
    }

    const payment = payments.p2wpkh({ address: identity, network });
    this.scriptPubKey = payment.output!.toString('hex');
    this.address = payment.address!;
  }

  createTx(inputs: Array<any>, outputs: Array<any>): string {
    let psbt = new Psbt();

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

    outputs.forEach(o =>
      psbt.addOutput({
        script: Buffer.from(this.scriptPubKey, 'hex'),
        asset: Buffer.concat([
          Buffer.from('01', 'hex'), //prefix for unconfidential asset
          Buffer.from(o.asset, 'hex').reverse(),
        ]),
        value: confidential.satoshiToConfidentialValue(Number(o.value)),
        nonce: Buffer.from('00', 'hex'),
      } as any)
    );

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
