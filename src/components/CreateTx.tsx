import React, { useState } from 'react';
import { networks } from 'liquidjs-lib';

import Update from './UpdateTx';
import Wallet from '../wallet';
import InputWithCopy from '../elements/InputWithCopy';

interface Props {
  identity: string;
  network: string;
  utxos: Object;
  lbtc: string;
}

const Create: React.FunctionComponent<Props> = props => {
  const { identity, network, lbtc, utxos } = props;

  const currentNetwork = (networks as any)[network];
  const wallet = new Wallet(identity, currentNetwork);

  const [encoded, setEncoded] = useState('');

  const onEncode = (inputs: any[], outputs: any[]) => {
    const emptyPsbt = Wallet.createTx();
    const psbt = wallet.updateTx(emptyPsbt, inputs, outputs);
    setEncoded(psbt);
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
