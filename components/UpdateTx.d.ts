import React from 'react';
interface Props {
    network: string;
    utxos: Object;
    lbtc: string;
    inputs: Array<any>;
    outputs: Array<any>;
    onEncode(inputs: Array<any>, outputs: Array<any>): void;
    onSign?(): void;
}
declare const Update: React.FunctionComponent<Props>;
export default Update;
