import React from 'react';

import Circle from './Circle';
import { toHumanFriendlyString, fromSatoshi } from '../helpers';

interface Props {
  balances: any;
  lbtc: string;
}

const Balances: React.FunctionComponent<Props> = props => {
  return (
    <div>
      <p className="subtitle is-4">Balances</p>
      <div className="buttons is-centered">
        {Object.entries(props.balances).map(
          ([assetHash, balanceInSatoshis]: [string, any], index: number) => {
            let asset: string;
            if (assetHash === props.lbtc) asset = 'L-BTC';
            else asset = toHumanFriendlyString(assetHash);

            return (
              <Circle
                key={index}
                balance={fromSatoshi(balanceInSatoshis)}
                asset={asset}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default Balances;
