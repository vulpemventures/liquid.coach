import React, { useState } from 'react';
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

const Create: React.FunctionComponent<Props> = props => {
  const { identity, network, lbtc, utxos, blindingKey } = props;

  const currentNetwork = (networks as any)[network];
  const wallet = new Wallet(identity, currentNetwork, blindingKey);

  const [encoded, setEncoded] = useState('');

  const onEncode = (inputs: any[], outputs: any[]) => {
    const emptyPsbt = Wallet.createTx();
    const psbt = wallet.updateTx(emptyPsbt, inputs, outputs);
    setEncoded(psbt);
  };

  const onSign = () => {
    if (encoded.length === 0)
      return alert('Encode the transaction on every change before signing');

    const mnemonic = prompt("What's your mnemonic?");
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
      <Update
        network={network}
        lbtc={lbtc}
        utxos={utxos}
        inputs={[]}
        outputs={[]}
        onEncode={onEncode}
        onSign={onSign}
      />
      {encoded.length > 0 && (
        <div className="box">
          {' '}
          <InputWithCopy value={encoded} />{' '}
        </div>
      )}
    </div>
  );
};

export default Create;
