import React from 'react';

interface Props {}

const Spinner: React.FunctionComponent<Props> = () => (
  <section className="section">
    <div className="buttons is-centered">
      <span className="loader"></span>
    </div>
  </section>
);

export default Spinner;
