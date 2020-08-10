import {
  ECPair,
  Psbt,
  confidential,
  address,
  payments,
  Network,
  Transaction,
} from 'liquidjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { toAssetHash, isValidBlindingKey } from '../helpers';
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
  script?: string;
}

export default class LiquidWallet {
  scriptPubKey: string;
  blindingKey?: string;
  address: string;
  network: Network;

  constructor(identity: string, network: Network, blindingKey?: string) {
    try {
      address.toOutputScript(identity, network);
      if (blindingKey && !isValidBlindingKey)
        throw new Error("Invalid blinding key");
    } catch (ignore) {
      throw new Error('Invalid address');
    }

    const payOpts = blindingKey ? { confidentialAddress: identity } : { address: identity };
    const payment = payments.p2wpkh({ ...payOpts, network });
    this.scriptPubKey = payment.output!.toString('hex');
    this.address = payment.address!;
    this.network = network;
    this.blindingKey = blindingKey;
  }

  static createTx(): string {
    const psbt = new Psbt();
    return psbt.toBase64();
  }

  static isValidMnemonic(m: string): boolean {
    return bip39.validateMnemonic(m);
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
      const script = i.witnessUtxo!.script.toString('hex');
      const value = confidential.confidentialValueToSatoshi(
        i.witnessUtxo?.value!
      );
      const asset = toAssetHash(i.witnessUtxo?.asset!);

      inputs.push({
        txid,
        vout,
        value,
        asset,
        script,
      });
    });

    transaction.outs.forEach(o => {
      const asset = toAssetHash(o.asset);
      const value = confidential.confidentialValueToSatoshi(o.value);

      const addr = o.script.equals(Buffer.alloc(0))
        ? 'LBTC_FEES'
        : address.fromOutputScript(o.script, this.network);

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
          script: i.script
            ? Buffer.from(i.script, 'hex')
            : Buffer.from(this.scriptPubKey, 'hex'),
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
      const script =
        o.address === 'LBTC_FEES'
          ? Buffer.alloc(0)
          : address.toOutputScript(o.address, this.network);

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

  signPsbtWithMnemonic(psbtBase64: string, mnemonic: string) {
    const seed = bip39.mnemonicToSeedSync(mnemonic!);
    const root = bip32.fromSeed(seed, this.network);
    const node = root.derivePath("m/84'/0'/0'/0");
    const keyPair = ECPair.fromWIF(node.toWIF(), this.network);
    const wpkh = payments.p2wpkh({
      pubkey: keyPair.publicKey,
      network: this.network,
    });

    const decoded = Psbt.fromBase64(psbtBase64);
    const inputIndex = decoded.data.inputs.findIndex(
      p =>
        p.witnessUtxo!.script.toString('hex') === wpkh.output!.toString('hex')
    );
    decoded.signInput(inputIndex, keyPair);
    decoded.validateSignaturesOfInput(inputIndex);

    //Let's finalize all inputs
    decoded.validateSignaturesOfAllInputs();
    decoded.finalizeAllInputs();

    const hex = decoded.extractTransaction().toHex();
    return hex;
  }
}

export function fetchUtxos(address: string, url: string): Promise<any> {
  return fetch(`${url}/address/${address}/utxo`).then(r => r.json());
}

export async function unblindUtxos(utxos: Array<any>, blindingKey: string, url: string) {
  const promises = utxos.map(utxo =>
    fetch(`${url}/tx/${utxo.txid}/hex`)
      .then(r => r.text())
      .then((txHex: string) => {
        const prevTx = Transaction.fromHex(txHex);
        const prevOut = prevTx.outs[utxo.vout];
        return { prevOut, utxo };
      })
  );
  try {
    const prevOuts = await Promise.all(promises);
    const unblinds = prevOuts.map((po: any) => {
      const { prevOut, utxo } = po;
      const result = confidential.unblindOutput(
        prevOut.nonce,
        Buffer.from(blindingKey, 'hex'),
        prevOut.rangeProof!,
        prevOut.value,
        prevOut.asset,
        prevOut.script
      );
      const assetHash = result.asset.reverse().toString('hex');
      return { ...result, asset: assetHash, txid: utxo.txid, vout: utxo.vout };
    });
    return unblinds;
  } catch (e) {
    throw e;
  }
}


export function faucet(address: string, url: string): Promise<any> {
  return fetch(`${url}/faucet`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
}

export function mint(
  address: string,
  quantity: number,
  url: string
): Promise<any> {
  return fetch(`${url}/mint`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, quantity }),
  });
}
export async function fetchBalances(
  address: string,
  url: string,
  blindingKey?: string
): Promise<any> {
  let fetchedData = (await fetchUtxos(address, url)).map((utxo: any) => {
    return utxo;
  });

  if (blindingKey && isValidBlindingKey(blindingKey)) {
    fetchedData = await unblindUtxos(fetchedData, blindingKey, url);
  }

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


