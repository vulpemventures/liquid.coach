import { address, Network, confidential, networks } from 'liquidjs-lib';

export const validate = (
  value: any,
  type: string,
  network: Network = networks.regtest
): Boolean => {
  switch (type) {
    case 'asset':
      if (value.length !== 64) {
        return false;
      }
      return true;
    case 'address':
      try {
        address.toOutputScript(value, network);
      } catch (ignore) {
        return false;
      }
      return true;
    case 'amount':
      try {
        confidential.satoshiToConfidentialValue(Number(value));
        console.log('is actually valid');
      } catch (ignore) {
        console.log(value);
        console.log(ignore);
        console.log('is not valid');
        return false;
      }
      return true;
    default:
      return false;
  }
};

/**
 * Shortens a long ethereum address to a human-friendly abbreviated one. Assumes the address starts with '0x'.
 *
 * An address like 0x2ed982c220fed6c9374e63804670fc16bd481b8f provides no more value to a human than
 * a shortened version like 0x2ed9...1b8f. However, screen real estate is precious, especially to real users
 * and not developers with high-res monitors.
 */
export function toHumanFriendlyString(x: string) {
  const previewLength = 4;

  const previewPrefix = x.substring(0, previewLength);
  const previewSuffix = x.substring(x.length - previewLength);

  return `${previewPrefix}...${previewSuffix}`;
}
