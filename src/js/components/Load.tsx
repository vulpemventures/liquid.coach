import React from 'react';

interface Props {
  onLoad(address: string): void;
}

export default class Load extends React.Component<Props> {
  render() {
    return (
      <div className="column has-text-centered is-10-mobile is-6-desktop is-offset-1-mobile is-offset-3-desktop">
        <input
          type="text"
          className="input is-medium"
          placeholder="Your Liquid address here..."
        />
        <br />
        <br />
        <button
          className="button is-link is-large"
          onClick={() => this.props.onLoad('MyAddress')}
        >
          Load
        </button>
      </div>
    );
  }
}
