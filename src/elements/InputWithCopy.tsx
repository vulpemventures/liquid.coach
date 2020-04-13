import React, { useState } from 'react';
import { copyToClipboard } from 'copy-lite';

interface Props {
  value: string;
}
export const InputWithCopy: React.FunctionComponent<Props> = props => {
  const [copySuccess, setCopySuccess] = useState('');

  const copy = () => {
    copyToClipboard(props.value);
    setCopySuccess('👌 Copied!');
  };

  return (
    <div className="notification is-success">
      <button className="button is-pulled-right" onClick={copy}>
        Copy
      </button>
      <p className="subtitle">{copySuccess}</p>
      <p className="subtitle">{props.value}</p>
    </div>
  );
};

export default InputWithCopy;
