import React from 'react';
interface Props {
    onLoad(identity: string, network: string, blindingPrivKey?: string): void;
}
declare const Load: React.FunctionComponent<Props>;
export default Load;
