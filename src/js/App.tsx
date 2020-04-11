import React, { Component } from 'react';
import Layout from './components/Layout';
import Load from './components/Load';
import Wallet from './components/Wallet';

interface Props {}

interface State {
  address: string;
  isLoaded: Boolean;
}

class App extends Component<Props, State> {
  state = {
    address: '',
    isLoaded: false,
  };

  render() {
    return (
      <div>
        <Layout title="🏋️‍♂️ Liquid.Coach">
          <div className="container">
            <div className="container">
              <div className="columns">
                {!this.state.isLoaded ? (
                  <Load
                    onLoad={(address: string) =>
                      this.setState({ address, isLoaded: true })
                    }
                  />
                ) : (
                  <Wallet address={this.state.address} />
                )}
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}

export default App;
