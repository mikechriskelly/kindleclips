import alt from '../core/alt';
import fetch from '../core/fetch';
import history from '../core/history';


class SearchActions {
  async fetchClips(searchTerm) {
    const query = searchTerm ?
      `{clips(search:"${searchTerm}"){id,title,author,text}}` :
      '{clips{id,title,author,text}}';

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      credentials: 'include',
    });

    const { data } = await resp.json();

    if (!data || !data.clips) {
      this.failedClips();
    } else {
      this.updateClips(data.clips);
    }
  }

  updateClips(results) {
    return results;
  }

  failedClips() {
    return 'Could not fetch clips';
  }

  async uploadClips(files) {
    const formData = new FormData();
    formData.append('myClippingsTxt', files[0]);

    const resp = await fetch('/api/clips/upload', {
      method: 'post',
      body: formData,
      credentials: 'include',
    });

    if (resp.status === 200) {
      history.push('/');
    } else {
      console.log('Error');
    }
  }
}

export default alt.createActions(SearchActions);
