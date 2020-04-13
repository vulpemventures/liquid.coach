import React from 'react';

import Create from './CreateTx';

import Balances from '../elements/Balances';
import Spinner from '../elements/Spinner';

import { fetchBalances, EXPLORER_URL } from '../wallet';
import { networks } from 'liquidjs-lib';

interface Props {
  identity: string;
  network: string;
}

interface State {
  showCreate: Boolean;
  showImport: Boolean;
  hasBalances: Boolean;
  isLoading: Boolean;
  utxos: any;
  balances: any;
}

export default class Wallet extends React.Component<Props, State> {
  state = {
    showCreate: false,
    showImport: false,
    hasBalances: false,
    balances: {},
    utxos: {},
    isLoading: true,
  };

  componentDidMount() {
    const { identity, network } = this.props;

    //TODO now we accept only addresses, check all possible derivation in future.
    fetchBalances(identity, (EXPLORER_URL as any)[network])
      .then((data: any) => {
        if (Object.keys(data.utxos).length > 0)
          this.setState({
            balances: data.balances,
            utxos: data.utxos,
            hasBalances: true,
            isLoading: false,
          });
        else this.setState({ isLoading: false });
      })
      .catch(console.error);
  }

  render() {
    const { network, identity } = this.props;
    const {
      showCreate,
      showImport,
      balances,
      hasBalances,
      isLoading,
      utxos,
    } = this.state;

    const LBTC_ASSET_HASH = (networks as any)[network].assetHash;

    return (
      <div className="column has-text-centered">
        {!isLoading && hasBalances && (
          <Balances balances={balances} lbtc={LBTC_ASSET_HASH} />
        )}
        {!isLoading && !hasBalances && (
          <h1 className="title is-6">
            {' '}
            You don't have any unspent output. Your balances will appear here.{' '}
          </h1>
        )}
        {isLoading && <Spinner />}
        <br />
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
        {!isLoading && showCreate && (
          <Create
            utxos={utxos}
            lbtc={LBTC_ASSET_HASH}
            identity={identity}
            network={network}
          />
        )}
        {showImport && <p className="subtitle">Coming soon</p>}
      </div>
    );
  }
}
