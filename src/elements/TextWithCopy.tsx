import React, { useState } from 'react';
import { copyToClipboard } from 'copy-lite';

interface Props {
  value: string;
  label?: string;
}
export const TextWithCopy: React.FunctionComponent<Props> = props => {
  const [copySuccess, setCopySuccess] = useState('');

  const copy = () => {
    copyToClipboard(props.value);
    setCopySuccess('👌 Copied!');
    setTimeout(() => setCopySuccess(''), 1500);
  };

  return (
    <span onClick={copy}>
      <p className="subtitle">
        {props.label || props.value} {copySuccess}
      </p>
    </span>
  );
};

export default TextWithCopy;
