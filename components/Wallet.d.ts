import React from 'react';
interface Props {
    identity: string;
    network: string;
    explorerUrl?: string;
    blindingKey?: string;
}
interface State {
    showCreate: Boolean;
    showImport: Boolean;
    hasBalances: Boolean;
    isLoading: Boolean;
    utxos: any;
    balances: any;
}
export default class Wallet extends React.Component<Props, State> {
    state: {
        showCreate: boolean;
        showImport: boolean;
        hasBalances: boolean;
        balances: {};
        utxos: {};
        isLoading: boolean;
    };
    componentDidMount(): void;
    getBalances: () => void;
    callFaucet: () => void;
    callMint: () => void;
    render(): JSX.Element;
}
export {};
