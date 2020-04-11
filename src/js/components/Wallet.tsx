import React from 'react';

import Balances from './Balances';
import Create from './CreateTx';

interface Props {
  address: string;
}

interface State {
  showCreate: Boolean;
  showImport: Boolean;
}

const utxos = {
  'L-BTC': [
    { txid: 'foo', value: 1000, asset: 'aaa' },
    { txid: 'bar', value: 5000, asset: 'bbb' },
  ],
  'L-USDT': [{ txid: 'franchi', value: 400, asset: 'ccc' }],
};

const balances = [
  [0.085, 'LBTC'],
  [55, 'USDT'],
];

export default class Wallet extends React.Component<Props, State> {
  state = {
    showCreate: false,
    showImport: false,
  };

  render() {
    const { showCreate, showImport } = this.state;
    return (
      <div className="column has-text-centered">
        <Balances balances={balances} />
        <p className="subtitle is-4">Transaction</p>
        <button
          className={`button is-large ${showCreate && `is-link`}`}
          onClick={() =>
            this.setState({
              showCreate: true,
              showImport: false,
            })
          }
        >
          <span role="img" aria-label="create">
            🛠
          </span>{' '}
          Create
        </button>
        <button
          className={`button is-large ${showImport && `is-link`}`}
          onClick={() =>
            this.setState({
              showImport: true,
              showCreate: false,
            })
          }
        >
          <span role="img" aria-label="import">
            📀
          </span>{' '}
          Import
        </button>
        <br />
        <br />
        {showCreate && <Create utxos={utxos} />}
        {showImport && <p className="subtitle">Coming soon</p>}
      </div>
    );
  }
}
