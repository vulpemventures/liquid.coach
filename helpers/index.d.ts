/// <reference types="node" />
export * from './xpub';
export * from './inputs';
/**
 * Shortens a long string to a human-friendly abbreviated one.
 *
 * A string like 2ed982c220fed6c9374e63804670fc16bd481b8f provides no more value to a human than
 * a shortened version like 2ed9...1b8f. However, screen real estate is precious, especially to real users
 * and not developers with high-res monitors.
 */
export declare function toHumanFriendlyString(x: string): string;
export declare function fromSatoshi(x: number): number;
export declare function toSatoshi(x: number): number;
export declare function toAssetHash(x: Buffer): string;
