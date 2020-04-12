const fetch = window.fetch;

export const EXPLORER_URL = {
  liquid: 'https://blockstream.info/liquid/api',
  regtest: 'https://nigiri.network/liquid/api',
};

export function fetchUtxos(address: string, url: string): Promise<any> {
  return fetch(`${url}/address/${address}/utxo`).then(r => r.json());
}

export async function fetchBalances(
  address: string,
  url: string
): Promise<any> {
  const fetchedData = await fetchUtxos(address, url);
  const balances = fetchedData.reduce(
    (storage: { [x: string]: any }, item: { [x: string]: any; value: any }) => {
      // get the first instance of the key by which we're grouping
      var group = item['asset'];

      // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
      storage[group] = storage[group] || 0;

      // add this item to its group within `storage`
      storage[group] += item.value;

      // return the updated storage to the reduce function, which will then loop through the next
      return storage;
    },
    {}
  ); // {} is the initial value of the storage

  const utxos = fetchedData.reduce(
    (storage: { [x: string]: any }, item: { [x: string]: any; value: any }) => {
      // get the first instance of the key by which we're grouping
      var group = item['asset'];

      // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
      storage[group] = storage[group] || [];

      // add this item to its group within `storage`
      storage[group].push(item);

      // return the updated storage to the reduce function, which will then loop through the next
      return storage;
    },
    {}
  ); // {} is the initial value of the storage

  return {
    balances,
    utxos,
  };
}
