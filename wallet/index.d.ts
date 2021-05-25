/// <reference types="node" />
import { Network } from 'liquidjs-lib';
export declare const EXPLORER_URL: {
    liquid: string;
    regtest: string;
};
interface UtxoInterface {
    txid: string;
    vout: number;
    asset: string;
    value: number;
    script?: string;
    partialSig?: Array<any>;
    sighashType?: number;
}
export default class LiquidWallet {
    scriptPubKey: string;
    blindingKey?: string;
    address: string;
    network: Network;
    constructor(identity: string, network: Network, blindingKey?: string);
    static createTx(): string;
    static isValidMnemonic(m: string): boolean;
    static isValidWIF(wif: string, network: Network): boolean;
    decodeTx(psbtBase64: string): any;
    updateTx(psbtBase64: string, inputs: Array<UtxoInterface>, outputs: Array<any>): string;
    signPsbtWithMnemonic(psbtBase64: string, mnemonic: string): string;
    signPsbtWithPrivateKey(psbtBase64: string, wif: string): string;
    private sign;
    private partiallySign;
}
export declare function fetchUtxos(address: string, url: string): Promise<any>;
export declare function unblindUtxos(utxos: Array<any>, blindingKey: string, url: string): Promise<{
    asset: string;
    txid: any;
    vout: any;
    value: string;
    valueBlindingFactor: Buffer;
    assetBlindingFactor: Buffer;
}[]>;
export declare function faucet(address: string, url: string): Promise<any>;
export declare function mint(address: string, quantity: number, url: string): Promise<any>;
export declare function fetchBalances(address: string, url: string, blindingKey?: string): Promise<any>;
export {};
