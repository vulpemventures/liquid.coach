import React, { useState, useRef } from 'react';

import { isValidXpub, isValidAddress } from '../helpers';
import { networks, Network } from 'liquidjs-lib';

interface Props {
  onLoad(identity: string, network: Network): void;
}

const Load: React.FunctionComponent<Props> = props => {
  const [isLiquid, setIsLiquid] = useState(false);
  const pubkey = useRef(null);

  const checkInput = () => {
    if (!pubkey || !pubkey.current) return alert('Missing extended public key');

    const pub: any = (pubkey.current as any).value;
    const network: Network = isLiquid
      ? (networks as any).bitcoin
      : networks.regtest;
    if (!isValidXpub(pub, network) && !isValidAddress(pub, network))
      return alert('Xpub or Adrress is not valid');

    props.onLoad(pub, network);
  };

  return (
    <div className="column has-text-centered is-10-mobile is-6-desktop is-offset-1-mobile is-offset-3-desktop">
      <div className="field" onClick={() => setIsLiquid(!isLiquid)}>
        <input
          type="checkbox"
          className="switch is-medium is-link"
          checked={isLiquid}
          onChange={() => {}}
        />
        <label className="label">{`${isLiquid ? 'Liquid' : 'Regtest'}`}</label>
      </div>
      <input
        type="text"
        ref={pubkey}
        className="input is-medium"
        placeholder="Your Segwit address here..."
      />
      <br />
      <br />
      <button className="button is-link is-large" onClick={checkInput}>
        Load
      </button>
    </div>
  );
};

export default Load;
