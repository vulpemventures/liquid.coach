import React, { useRef, useState } from 'react';
import { networks } from 'liquidjs-lib';

import Update from './UpdateTx';
import Wallet from '../wallet';
import InputWithCopy from '../elements/InputWithCopy';

interface Props {
  identity: string;
  blindingKey?: string;
  network: string;
  utxos: Object;
  lbtc: string;
}

const Decode: React.FunctionComponent<Props> = props => {
  const { identity, network, lbtc, utxos, blindingKey } = props;

  const currentNetwork = (networks as any)[network];
  const wallet = new Wallet(identity, currentNetwork, blindingKey);

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
    if (encoded.length === 0)
      return alert('Encode the transaction on every change before signing');

    const mnemonic = prompt("What's your mnemonic? m/84'/0'/0'/0");
    if (!Wallet.isValidMnemonic(mnemonic!)) return alert('Mnemonic not valid');

    try {
      const hex = wallet.signPsbtWithMnemonic(encoded, mnemonic!);
      setEncoded(hex);
    } catch (ignore) {
      return alert(ignore);
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
