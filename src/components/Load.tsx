import React, { useState, useRef } from 'react';

import { networks, Network, payments } from 'liquidjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';

import InputWithCopy from '../elements/InputWithCopy';
import { isValidXpub, isValidAddress, changeVersionBytes } from '../helpers';

interface Props {
  onLoad(identity: string, network: string): void;
}

const Load: React.FunctionComponent<Props> = props => {
  const [isLiquid, setIsLiquid] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pubkey = useRef(null);

  const networkString: string = isLiquid ? 'liquid' : 'regtest';
  const currentNetwork: Network = (networks as any)[networkString];

  const checkInput = () => {
    if (!pubkey || !pubkey.current)
      return alert('Missing either address or extended public key');

    const pub: any = (pubkey.current as any).value;
    if (
      !isValidXpub(pub, currentNetwork) &&
      !isValidAddress(pub, currentNetwork)
    )
      return alert('Xpub or Segwit Address is not valid');

    props.onLoad(pub, networkString);
  };

  const confirmModal = () => {
    const mnemonic = bip39.generateMnemonic();
    if (!bip39.validateMnemonic(mnemonic)) return alert('Something went wrong');

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, currentNetwork);
    const xpub = root.toBase58();
    const zpub = changeVersionBytes(xpub, 'zpub');

    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Liquid regtest wallet</p>
          </header>
          <section className="modal-card-body">
            <label className="label">Mnemonic</label>
            <p className="subtitle is-6">
              You will never see it again. You may want to write it down
            </p>
            <InputWithCopy value={mnemonic} bgColor="is-info is-light" />
            <label className="label">Extended public key</label>
            <InputWithCopy value={zpub} bgColor="is-info is-light" />
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-primary"
              onClick={() => {
                const node = root.derivePath("m/84'/0'/0'/0");
                const wpkh = payments.p2wpkh({
                  pubkey: node.publicKey,
                  network: currentNetwork,
                });

                props.onLoad(wpkh.address!, networkString);
              }}
            >
              Confirm
            </button>
            <button className="button" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    );
  };

  return (
    <div className="column has-text-centered is-10-mobile is-6-desktop is-offset-1-mobile is-offset-3-desktop">
      <div className="field" onClick={() => setIsLiquid(!isLiquid)}>
        <input
          type="checkbox"
          className="switch is-medium is-link"
          checked={isLiquid}
          onChange={() => {}}
        />
        <label className="label">{`${isLiquid ? 'Liquid' : 'Regtest'}`}</label>
      </div>
      <input
        type="text"
        ref={pubkey}
        className="input is-medium"
        placeholder="Your Segwit address here..."
      />
      <br />
      <br />
      <button className="button is-link is-large" onClick={checkInput}>
        Load
      </button>
      <br />
      <br />
      <div>
        <p className="subtitle">or create a new one...</p>
        <button
          className="button is-primary is-large"
          onClick={() => setShowConfirm(true)}
        >
          Generate
        </button>
        {showConfirm && confirmModal()}
      </div>
    </div>
  );
};

export default Load;
