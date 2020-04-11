import React from 'react';

interface Props {
  asset: string;
  balance: number;
}

const Circle: React.FunctionComponent<Props> = props => {
  return (
    <div
      className="hero box is-inline-block has-background-link"
      style={{
        borderRadius: '50%',
        height: '250px',
        width: '250px',
        margin: '2rem',
      }}
    >
      <div className="hero-body">
        <div className="container">
          <p className="subtitle is-5 has-text-white"> {props.asset}</p>
          <h1 className="title is-1 has-text-white"> {props.balance} </h1>
        </div>
      </div>
    </div>
  );
};

export default Circle;
