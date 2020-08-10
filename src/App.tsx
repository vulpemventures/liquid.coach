import React from 'react';
import Layout from './components/Layout';
import Load from './components/Load';
import Wallet from './components/Wallet';
import useGlobalStorage from 'use-global-storage';

interface Props { }

const App: React.FunctionComponent<Props> = () => {
  const useStorage = useGlobalStorage({
    storageOptions: { name: 'liquid-coach-db' },
  });

  const [state, setState] = useStorage('state', null);

  return (
    <div>
      <Layout
        title="🏋️‍♂️ Liquid.Coach"
        showExplorer={!state}
        onExplorer={(explorer: string) => {
          setState({
            explorerUrl: explorer,
          });
        }}
        onClean={() => {
          setState(null);
        }}
      >
        <div className="container">
          <div className="container">
            <div className="columns">
              {!state || !state.loaded ? (
                <Load
                  onLoad={(
                    xpubOrAddress: string,
                    selectedNetwork: any,
                    blindingPrivKey: string
                  ) => {
                    setState({
                      loaded: true,
                      identity: xpubOrAddress,
                      network: selectedNetwork,
                      blindingKey: blindingPrivKey,
                      ...state,
                    });
                  }}
                />
              ) : (
                  <Wallet
                    identity={state.identity}
                    network={state.network}
                    blindingKey={
                      state.blindingKey && state.blindingKey.length > 0
                        ? state.blindingKey
                        : undefined
                    }
                    explorerUrl={state.explorerUrl}
                  />
                )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default App;
