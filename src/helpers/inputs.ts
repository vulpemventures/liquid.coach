import { address, Network, confidential, networks } from 'liquidjs-lib';

function isValidConfidentialAddress(value: string): boolean {
  try {
    address.fromConfidential(value);
    return true;
  } catch (e) {
    return false;
  }
}

export function validate(
  value: any,
  type: string,
  network: Network = networks.regtest
): boolean {
  switch (type) {
    case 'asset':
      if (value.length !== 64) {
        return false;
      }
      return true;
    case 'address':
      try {
        if (isValidConfidentialAddress(value))
          throw new Error('Unconfidential only');
        if (value !== 'LBTC_FEES') address.toOutputScript(value, network);
      } catch (ignore) {
        console.error(ignore);
        return false;
      }
      return true;
    case 'amount':
      try {
        confidential.satoshiToConfidentialValue(Number(value));
      } catch (ignore) {
        return false;
      }
      return true;
    default:
      return false;
  }
}
