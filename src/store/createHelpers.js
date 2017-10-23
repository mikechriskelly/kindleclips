function createGraphqlRequest(fetch) {
  return async function graphqlRequest(query, variables) {
    const fetchConfig = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // TODO: Insert user token into request
        // Authorization: token ? `Bearer ${token}` : null,
      },
      body: JSON.stringify({ query, variables }),
      credentials: 'include',
    };
    const resp = await fetch('/graphql', fetchConfig);
    if (resp.status !== 200) throw new Error(resp.statusText);
    return resp.json();
  };
}

// TODO: Determine if these 3 old functions are still needed
export function getPrimaryClipID() {
  return this.state.primaryClip.id;
}

export function randomKey() {
  return Math.random().toString(36).substr(2, 9);
}

export function findIndex(array, attr, value) {
  for (let i = 0; i < array.length; i += 1) {
    if (
      Object.prototype.hasOwnProperty.call(array[i], attr) &&
      array[i][attr] === value
    ) {
      return i;
    }
  }
  return -1;
}

export default function createHelpers({ fetch, history }) {
  return {
    fetch,
    history,
    graphqlRequest: createGraphqlRequest(fetch),
  };
}
