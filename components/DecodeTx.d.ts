import React from 'react';
interface Props {
    identity: string;
    blindingKey?: string;
    network: string;
    utxos: Object;
    lbtc: string;
}
declare const Decode: React.FunctionComponent<Props>;
export default Decode;
