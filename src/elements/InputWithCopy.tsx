import React, { useState } from 'react';
import { copyToClipboard } from 'copy-lite';

interface Props {
  value: string;
  bgColor?: string;
}
export const InputWithCopy: React.FunctionComponent<Props> = props => {
  const [copySuccess, setCopySuccess] = useState('');

  const copy = () => {
    copyToClipboard(props.value);
    setCopySuccess('👌 Copied!');
  };

  return (
    <div className={`notification ${props.bgColor || 'is-success'}`}>
      <button className="button is-pulled-right" onClick={copy}>
        Copy
      </button>
      <p className="subtitle">{copySuccess}</p>
      <br />
      <p className="subtitle">{props.value}</p>
    </div>
  );
};

export default InputWithCopy;
