import alt from '../core/alt';
import fetch from '../core/fetch';


class SearchActions {
  async fetchClips() {
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{clips(search:"zen"){id,title,author,text}}',
      }),
      credentials: 'include',
    });
    const { data } = await resp.json();
    if (!data || !data.clips) this.failedClips();
    this.updateClips(data.clips);
    return true;
  }

  updateClips(results) {
    return results;
  }

  failedClips() {
    return 'Could not fetch clips';
  }
}

export default alt.createActions(SearchActions);
