import React from 'react';
interface Props {
    identity: string;
    blindingKey?: string;
    network: string;
    utxos: Object;
    lbtc: string;
}
declare const Create: React.FunctionComponent<Props>;
export default Create;
