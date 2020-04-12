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
