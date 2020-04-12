export * from './xpub';
export * from './inputs';

/**
 * Shortens a long string to a human-friendly abbreviated one.
 *
 * A string like 2ed982c220fed6c9374e63804670fc16bd481b8f provides no more value to a human than
 * a shortened version like 2ed9...1b8f. However, screen real estate is precious, especially to real users
 * and not developers with high-res monitors.
 */
export function toHumanFriendlyString(x: string) {
  const previewLength = 4;

  const previewPrefix = x.substring(0, previewLength);
  const previewSuffix = x.substring(x.length - previewLength);

  return `${previewPrefix}...${previewSuffix}`;
}

export function fromSatoshi(x: number) {
  return Math.floor(x) / Math.pow(10, 8);
}

export function toSatoshi(x: number) {
  return Math.floor(x * Math.pow(10, 8));
}
