import React, { useRef, useState } from 'react';

interface Props {
  value: string;
}
export const InputWithCopy: React.FunctionComponent<Props> = props => {
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  function copyToClipboard(e: any) {
    (textAreaRef.current as any).select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    setCopySuccess('👌 Copied!');
  }

  return (
    <div className="notification is-success">
      {/* Logical shortcut for only displaying the 
          button if the copy command exists */
      document.queryCommandSupported('copy') && (
        <div>
          <button className="button is-pulled-right" onClick={copyToClipboard}>
            Copy
          </button>
          {copySuccess}
        </div>
      )}
      <form className="form">
        <textarea
          disabled
          style={{ border: 'none', backgroundColor: 'transparent' }}
          className="textarea has-text-centered has-fixed-size has-text-white"
          ref={textAreaRef}
          value={props.value}
        />
      </form>
    </div>
  );
};

export default InputWithCopy;
