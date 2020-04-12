import React from 'react';
import Layout from './components/Layout';
import Load from './components/Load';
import Wallet from './components/Wallet';
import useGlobalStorage from 'use-global-storage';

interface Props {}

const App: React.FunctionComponent<Props> = () => {
  const useStorage = useGlobalStorage({
    storageOptions: { name: 'liquid-coach-db' },
  });

  const [state, setState] = useStorage('state', null);

  return (
    <div>
      <Layout
        title="🏋️‍♂️ Liquid.Coach"
        onClean={() => {
          setState(null);
        }}
      >
        <div className="container">
          <div className="container">
            <div className="columns">
              {!state ? (
                <Load
                  onLoad={(xpubOrAddress: string, selectedNetwork: any) => {
                    setState({
                      identity: xpubOrAddress,
                      network: selectedNetwork,
                    });
                  }}
                />
              ) : (
                <Wallet identity={state.identity} network={state.network} />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default App;
