// This has benne taken from https://github.com/Casa/xpub-converter/blob/master/js/xpubConvert.js
/*
  This script uses version bytes as described in SLIP-132
  https://github.com/satoshilabs/slips/blob/master/slip-0132.md
*/
import b58 from 'bs58check';
import bip32 from 'bip32';
import { address, Network } from 'liquidjs-lib';

const prefixes = new Map([
  ['xpub', '0488b21e'],
  ['ypub', '049d7cb2'],
  ['Ypub', '0295b43f'],
  ['zpub', '04b24746'],
  ['Zpub', '02aa7ed3'],
  ['tpub', '043587cf'],
  ['upub', '044a5262'],
  ['Upub', '024289ef'],
  ['vpub', '045f1cf6'],
  ['Vpub', '02575483'],
]);

/*
 * This function takes an extended public key (with any version bytes, it doesn't need to be an xpub)
 * and converts it to an extended public key formatted with the desired version bytes
 * @param xpub: an extended public key in base58 format. Example: xpub6CpihtY9HVc1jNJWCiXnRbpXm5BgVNKqZMsM4XqpDcQigJr6AHNwaForLZ3kkisDcRoaXSUms6DJNhxFtQGeZfWAQWCZQe1esNetx5Wqe4M
 * @param targetFormat: a string representing the desired prefix; must exist in the "prefixes" mapping defined above. Example: Zpub
 */
export function changeVersionBytes(xpub: string, targetFormat: string) {
  if (!prefixes.has(targetFormat)) {
    return 'Invalid target version';
  }

  // trim whitespace
  xpub = xpub.trim();

  try {
    let data = b58.decode(xpub);
    data = data.slice(4);
    data = Buffer.concat([
      Buffer.from(prefixes.get(targetFormat)!, 'hex'),
      data,
    ]);
    return b58.encode(data);
  } catch (err) {
    throw new Error(
      "Invalid extended public key! Please double check that you didn't accidentally paste extra data."
    );
  }
}

export function isValidXpub(xpub: string, network: Network): Boolean {
  try {
    //bip32.fromBase58(xpub, network).derive(0).derive(addressIndex).publicKey
    bip32.fromBase58(xpub, network);
  } catch (e) {
    return false;
  }

  return true;
}

export function isValidAddress(value: string, network: Network) {
  try {
    address.toOutputScript(value, network);
  } catch (e) {
    return false;
  }

  return true;
}
