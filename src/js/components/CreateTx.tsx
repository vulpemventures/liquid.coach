import React, { useState, useRef } from 'react';

interface Props {
  utxos: Object;
}

const Create: React.FunctionComponent<Props> = props => {
  const utxosByAsset = props.utxos;

  const [inputAssetIndex, setInputAssetIndex] = useState(0);
  const [utxoIndex, setUtxoIndex] = useState(0);
  const [inputs, setInputs] = useState([]);

  const outputAsset = useRef(null);
  const outputValue = useRef(null);
  const outputAddress = useRef(null);
  const [outputs, setOutputs] = useState([]);

  const assets: Array<string> = Object.keys(utxosByAsset);
  const utxos: Array<any> = (utxosByAsset as any)[assets[inputAssetIndex]];

  const addInput = () => setInputs((is: any) => is.concat([utxos[utxoIndex]]));
  const onAssetChange = (e: any) => setInputAssetIndex(e.target.value);
  const onUtxoChange = (e: any) => setUtxoIndex(e.target.value);

  const addOutput = () =>
    setOutputs((os: any) =>
      os.concat([
        {
          value: (outputValue.current as any).value,
          asset: (outputAsset.current as any).value,
          address: (outputAddress.current as any).value,
        },
      ])
    );

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
                    {a}
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
                    {u.txid + ' ' + u.value}
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
                {i.asset}
              </button>
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                {i.txid + ' ' + i.value}
              </button>
            </div>
          ))}
        </span>
      </div>

      <div className="box">
        <h1 className="title">Outputs</h1>
        <div className="field has-addons">
          <div className="control is-expanded has-text-centered">
            <label className="label">Asset</label>
            <input
              className="input is-medium is-fullwidth"
              type="text"
              ref={outputAsset}
            />
          </div>
          <div className="control is-expanded has-text-centered">
            <label className="label">Address</label>
            <input
              className="input is-medium is-fullwidth"
              type="text"
              ref={outputAddress}
            />
          </div>
          <div className="control is-expanded has-text-centered">
            <label className="label">Amount</label>
            <input
              className="input is-medium is-fullwidth"
              type="number"
              ref={outputValue}
            />
          </div>
          <div className="control">
            <label style={{ visibility: 'hidden' }} className="label">
              <span role="img" aria-label="vulpem">
                🦊
              </span>
            </label>
            <button className="button is-link is-medium" onClick={addOutput}>
              {' '}
              Add{' '}
            </button>
          </div>
        </div>

        <span>
          {outputs.map((o: any, index: number) => (
            <div key={index} className="field has-addons">
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                {o.asset}
              </button>
              <button
                className="button is-medium is-fullwidth"
                style={{ borderColor: 'transparent' }}
              >
                {o.address}
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
    </div>
  );
};

export default Create;
