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
  const [identity, setIdentity] = useStorage('identity', null);
  const [, setNetwork] = useStorage('network', {});

  return (
    <div>
      <Layout title="🏋️‍♂️ Liquid.Coach" onClean={() => setIdentity(null)}>
        <div className="container">
          <div className="container">
            <div className="columns">
              {!identity ? (
                <Load
                  onLoad={(xpubOrAddress: string, selectedNetwork: any) => {
                    setIdentity(xpubOrAddress);
                    setNetwork(selectedNetwork);
                  }}
                />
              ) : (
                <Wallet identity={identity} />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default App;
