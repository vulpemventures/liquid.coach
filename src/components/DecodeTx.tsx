import React, { useRef, useState } from 'react';
import { networks, ECPair, Psbt, payments } from 'liquidjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';

import Update from './UpdateTx';
import Wallet from '../wallet';
import InputWithCopy from '../elements/InputWithCopy';

interface Props {
  identity: string;
  network: string;
  utxos: Object;
  lbtc: string;
}

const Decode: React.FunctionComponent<Props> = props => {
  const { identity, network, lbtc, utxos } = props;

  const currentNetwork = (networks as any)[network];
  const wallet = new Wallet(identity, currentNetwork);

  const [state, setState] = useState({
    hasBeenDecoded: false,
    inputs: [],
    outputs: [],
  });
  const [encoded, setEncoded] = useState('');
  const psbtInput = useRef(null);

  const onDecodeClick = (e: any) => {
    e.preventDefault();
    const { inputs, outputs } = wallet.decodeTx(
      (psbtInput.current! as any).value
    );
    setState({
      hasBeenDecoded: true,
      inputs,
      outputs,
    });
  };

  const onEncode = (inputs: any[], outputs: any[]) => {
    const emptyPsbt = Wallet.createTx();
    const psbt = wallet.updateTx(emptyPsbt, inputs, outputs);
    setEncoded(psbt);
  };

  const onSign = () => {
    const mnemonic = prompt("What's your mnemonic?");
    if (!bip39.validateMnemonic(mnemonic!)) return alert('Mnemonic not valid');

    try {
      const seed = bip39.mnemonicToSeedSync(mnemonic!);
      const root = bip32.fromSeed(seed, currentNetwork);
      const node = root.derivePath("m/84'/0'/0'/0");
      const keyPair = ECPair.fromWIF(node.toWIF(), currentNetwork);
      const wpkh = payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: currentNetwork,
      });

      const decoded = Psbt.fromBase64((psbtInput.current! as any).value);
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
      setEncoded(hex);
    } catch (ignore) {
      return alert('Invalid transaction');
    }
  };

  return (
    <div>
      <div className="field has-addons">
        <input
          type="text"
          ref={psbtInput}
          className="input is-medium"
          placeholder="Your base64 encoded PSBT here..."
        />
        <button className="button is-link is-medium" onClick={onDecodeClick}>
          Decode
        </button>
      </div>

      {state.hasBeenDecoded && (
        <Update
          network={network}
          lbtc={lbtc}
          utxos={utxos}
          inputs={state.inputs}
          outputs={state.outputs}
          onEncode={onEncode}
          onSign={onSign}
        />
      )}

      {encoded.length > 0 && (
        <div className="box">
          {' '}
          <InputWithCopy value={encoded} />{' '}
        </div>
      )}
    </div>
  );
};

export default Decode;
