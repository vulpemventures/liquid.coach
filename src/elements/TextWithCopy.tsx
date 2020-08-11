import React, { useState } from 'react';
import { copyToClipboard } from 'copy-lite';

interface Props {
  value: string;
  label?: string;
  textClass?: string;
}
export const TextWithCopy: React.FunctionComponent<Props> = props => {
  const [copySuccess, setCopySuccess] = useState('');

  const copy = () => {
    copyToClipboard(props.value);
    setCopySuccess('👌 Copied!');
    setTimeout(() => setCopySuccess(''), 1500);
  };

  const textClass = props.textClass ? props.textClass : 'subtitle';

  return (
    <span onClick={copy}>
      <p className={textClass}>
        {props.label || props.value} {copySuccess}
      </p>
    </span>
  );
};

export default TextWithCopy;
