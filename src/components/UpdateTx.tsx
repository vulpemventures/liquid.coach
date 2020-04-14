import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextWithCopy from '../elements/TextWithCopy';
import { validate, toHumanFriendlyString } from '../helpers';

interface Props {
  utxos: Object;
  lbtc: string;
  inputs: Array<any>;
  outputs: Array<any>;
  onEncode(inputs: Array<any>, outputs: Array<any>): void;
}

const Update: React.FunctionComponent<Props> = props => {
  const { utxos: utxosByAsset, lbtc } = props;

  const [inputAssetIndex, setInputAssetIndex] = useState(0);
  const [utxoIndex, setUtxoIndex] = useState(0);
  const [inputs, setInputs] = useState(props.inputs);
  const [outputs, setOutputs] = useState(props.outputs);

  const assets: Array<string> = Object.keys(utxosByAsset);
  const utxos: Array<any> = (utxosByAsset as any)[assets[inputAssetIndex]];

  const addInput = (e: any) => {
    e.preventDefault();
    setInputs((is: any) => is.concat([utxos[utxoIndex]]));
  };
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
                <TextWithCopy
                  label={
                    i.asset === lbtc ? 'L-BTC' : toHumanFriendlyString(i.asset)
                  }
                  value={i.asset}
                />
              </button>
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                <TextWithCopy
                  label={toHumanFriendlyString(i.txid) + ' ' + i.value}
                  value={i.txid}
                />
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
                <TextWithCopy
                  label={toHumanFriendlyString(o.asset)}
                  value={o.asset}
                />
              </button>
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                <TextWithCopy
                  label={toHumanFriendlyString(o.address)}
                  value={o.address}
                />
              </button>
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                <TextWithCopy label={o.value} value={o.value} />
              </button>
            </div>
          ))}
        </span>
      </div>

      <div className="box is-centered">
        <p className="subtitle"> Total inputs {inputs.length} </p>
        <p className="subtitle"> Total outputs {outputs.length} </p>
        <button
          className="button is-large"
          onClick={() => props.onEncode(inputs, outputs)}
        >
          <span role="img" aria-label="encode psbt">
            🚜
          </span>
          ‍Encode
        </button>
      </div>
    </div>
  );
};

export default Update;
