import React from 'react';

import Circle from './Circle';

interface Props {
  balances: Array<any>;
}

const Balances: React.FunctionComponent<Props> = props => {
  return (
    <div>
      <p className="subtitle is-4">Balances</p>
      <div className="buttons is-centered">
        {props.balances.map(
          ([balance, asset]: [number, string], index: number) => (
            <Circle key={index} balance={balance} asset={asset} />
          )
        )}
      </div>
    </div>
  );
};

export default Balances;
