import React from 'react';

import Create from './CreateTx';
import Decode from './DecodeTx';

import Balances from '../elements/Balances';
import Spinner from '../elements/Spinner';

import { fetchBalances, faucet, EXPLORER_URL, mint } from '../wallet';
import { networks } from 'liquidjs-lib';

interface Props {
  identity: string;
  network: string;
  explorerUrl?: string;
  blindingKey?: string;
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
    this.getBalances();
  }

  getBalances = () => {
    this.setState({ isLoading: true });

    const { identity, network, explorerUrl, blindingKey } = this.props;
    fetchBalances(
      identity,
      explorerUrl || (EXPLORER_URL as any)[network],
      blindingKey
    )
      .then((data: any) => {
        if (Object.keys(data.utxos).length > 0)
          this.setState({
            balances: data.balances,
            utxos: data.utxos,
            hasBalances: true,
            isLoading: false,
          });
        else this.setState({ isLoading: false });

        return;
      })
      .catch(e => {
        console.error(e);
        alert('Something went wrong. Explorer may be down');
        this.setState({ isLoading: false });
      });
  };

  callFaucet = () => {
    this.setState({ isLoading: true });

    faucet(this.props.identity, this.props.explorerUrl || EXPLORER_URL.regtest)
      .then(() => {
        return this.getBalances();
      })
      .catch(e => {
        console.error(e);
        alert('Something went wrong. Explorer may be down');
        this.setState({ isLoading: false });
      });
  };

  callMint = () => {
    this.setState({ isLoading: true });

    const qtyString = prompt('How many asset you want to issue?');

    if (!qtyString || isNaN(Number(qtyString))) {
      alert('You need to pass a valid amount');
      this.setState({ isLoading: false });
      return;
    }

    mint(
      this.props.identity,
      Number(qtyString),
      this.props.explorerUrl || EXPLORER_URL.regtest
    )
      .then(() => {
        return this.getBalances();
      })
      .catch(e => {
        console.error(e);
        alert('Something went wrong. Explorer may be down');
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { network, identity, blindingKey } = this.props;
    const {
      showCreate,
      showImport,
      balances,
      hasBalances,
      isLoading,
      utxos,
    } = this.state;

    const LBTC_ASSET_HASH = (networks as any)[network].assetHash;
    const isRegtest = network === 'regtest';

    return (
      <div className="column has-text-centered">
        <h1 className="title is-4">{identity}</h1>
        {!isLoading && hasBalances && (
          <Balances balances={balances} lbtc={LBTC_ASSET_HASH} />
        )}
        <br />
        {!isLoading && !hasBalances && (
          <p className="subtitle is-6">
            {' '}
            You don't have any unspent output. Your balances will appear here.{' '}
          </p>
        )}

        {isRegtest && !hasBalances && !isLoading && (
          <button className="button is-link" onClick={this.callFaucet}>
            <span role="img" aria-label="create">
              🚰
            </span>{' '}
            Faucet
          </button>
        )}

        {isRegtest && !isLoading && (
          <button className="button is-link" onClick={this.callMint}>
            <span role="img" aria-label="create">
              💸
            </span>{' '}
            Mint
          </button>
        )}

        {!hasBalances && !isLoading && (
          <button className="button" onClick={this.getBalances}>
            <span role="img" aria-label="create">
              ♻
            </span>{' '}
            Reload
          </button>
        )}

        {isLoading && <Spinner />}

        {hasBalances && (
          <section className="section">
            <p className="subtitle is-4">Transaction</p>
            <button
              className={`button is-large ${!isLoading &&
                showCreate &&
                `is-link`}`}
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
              className={`button is-large ${!isLoading &&
                showImport &&
                `is-link`}`}
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
          </section>
        )}
        {!isLoading && showCreate && (
          <Create
            utxos={utxos}
            lbtc={LBTC_ASSET_HASH}
            identity={identity}
            network={network}
            blindingKey={blindingKey}
          />
        )}
        {!isLoading && showImport && (
          <Decode
            utxos={utxos}
            lbtc={LBTC_ASSET_HASH}
            identity={identity}
            network={network}
          />
        )}
      </div>
    );
  }
}
