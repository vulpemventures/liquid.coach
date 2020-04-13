import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import InputWithCopy from '../elements/InputWithCopy';

import Wallet from '../wallet';
import { validate, toHumanFriendlyString } from '../helpers';
import { networks } from 'liquidjs-lib';

interface Props {
  identity: string;
  network: string;
  utxos: Object;
  lbtc: string;
}

const Create: React.FunctionComponent<Props> = props => {
  const { utxos: utxosByAsset, lbtc, identity, network } = props;

  const wallet = new Wallet(identity, (networks as any)[network]);

  const [inputAssetIndex, setInputAssetIndex] = useState(0);
  const [utxoIndex, setUtxoIndex] = useState(0);
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [encoded, setEncoded] = useState('');

  const assets: Array<string> = Object.keys(utxosByAsset);
  const utxos: Array<any> = (utxosByAsset as any)[assets[inputAssetIndex]];

  const addInput = () => setInputs((is: any) => is.concat([utxos[utxoIndex]]));
  const onAssetChange = (e: any) => {
    setInputAssetIndex(e.target.value);
    setUtxoIndex(0);
  };
  const onUtxoChange = (e: any) => setUtxoIndex(e.target.value);

  const { register, handleSubmit, errors, setError } = useForm();

  const addOutput = ({
    amount,
    asset,
    address,
  }: {
    amount: number;
    asset: string;
    address: string;
  }) => {
    if (!validate(asset, 'asset')) {
      setError('asset' as any);
      return;
    }

    if (!validate(address, 'address')) {
      setError('address' as any);
      return;
    }

    if (!validate(amount, 'amount')) {
      setError('amount' as any);
      return;
    }

    setOutputs((os: any) =>
      os.concat([
        {
          value: amount,
          asset,
          address,
        },
      ])
    );
  };

  const createTransaction = () => {
    const psbt = wallet.createTx(inputs, outputs);
    setEncoded(psbt);
  };

  return (
    <div>
      <div className="box">
        <h1 className="title">Inputs</h1>
        <div className="field has-addons">
          <div className="control is-expanded has-text-centered">
            <label className="label">Asset</label>
            <div className="select is-info is-medium is-fullwidth">
              <select value={inputAssetIndex} onChange={onAssetChange}>
                {assets.map((a: any, i: number) => (
                  <option key={i} value={i}>
                    {a === lbtc ? 'L-BTC' : toHumanFriendlyString(a)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="control is-expanded has-text-centered">
            <label className="label">Unspent</label>
            <div className="select is-info is-medium is-fullwidth">
              <select value={utxoIndex} onChange={onUtxoChange}>
                {utxos.map((u: any, i: number) => (
                  <option key={i} value={i}>
                    {toHumanFriendlyString(u.txid) + ' ' + u.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="control">
            <label style={{ visibility: 'hidden' }} className="label">
              <span role="img" aria-label="vulpem">
                🦊
              </span>
            </label>
            <button className="button is-link is-medium" onClick={addInput}>
              {' '}
              Add{' '}
            </button>
          </div>
        </div>

        <span>
          {inputs.map((i: any, index: number) => (
            <div key={index} className="field has-addons">
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                {i.asset === lbtc ? 'L-BTC' : toHumanFriendlyString(i.asset)}
              </button>
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                {toHumanFriendlyString(i.txid) + ' ' + i.value}
              </button>
            </div>
          ))}
        </span>
      </div>

      <div className="box">
        <h1 className="title">Outputs</h1>
        <form
          className="form"
          onSubmit={handleSubmit((data: any) => addOutput(data))}
        >
          <div className="field has-addons">
            <div className="control is-expanded has-text-centered">
              <label className="label">Asset</label>
              <input
                className="input is-medium is-fullwidth"
                type="text"
                name="asset"
                placeholder="Asset hash"
                ref={register({ required: true })}
              />
              {errors.asset && (
                <div className="notification is-danger">
                  This field is not valid
                </div>
              )}
            </div>
            <div className="control is-expanded has-text-centered">
              <label className="label">Address</label>
              <input
                className="input is-medium is-fullwidth"
                name="address"
                type="text"
                placeholder="Unconfidential address only"
                ref={register({ required: true })}
              />
              {errors.address && (
                <div className="notification is-danger">
                  This field is not valid
                </div>
              )}
            </div>
            <div className="control is-expanded has-text-centered">
              <label className="label">Amount</label>
              <input
                className="input is-medium is-fullwidth"
                name="amount"
                type="number"
                placeholder="In satoshis"
                ref={register({ required: true })}
              />
              {errors.amount && (
                <div className="notification is-danger">
                  This field is not valid
                </div>
              )}
            </div>
            <div className="control">
              <label style={{ visibility: 'hidden' }} className="label">
                <span role="img" aria-label="vulpem">
                  🦊
                </span>
              </label>
              <button type="submit" className="button is-link is-medium">
                {' '}
                Add{' '}
              </button>
            </div>
          </div>
        </form>

        <span>
          {outputs.map((o: any, index: number) => (
            <div key={index} className="field has-addons">
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                {toHumanFriendlyString(o.asset)}
              </button>
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                {toHumanFriendlyString(o.address)}
              </button>
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                {o.value}
              </button>
            </div>
          ))}
        </span>
      </div>

      <div className="box is-centered">
        <p className="subtitle"> Total inputs {inputs.length} </p>
        <p className="subtitle"> Total outputs {outputs.length} </p>
        <button className="button is-large" onClick={createTransaction}>
          <span role="img" aria-label="encode psbt">
            🚜
          </span>
          ‍Encode
        </button>
        <br />
        <br />
        {encoded.length > 0 && <InputWithCopy value={encoded} />}
      </div>
    </div>
  );
};

export default Create;
