import alt from '../core/alt';
import fetch from '../core/fetch';
import history from '../core/history';
import UserStore from '../stores/UserStore';

class SearchActions {

  async initialFetch() {
    return await this.searchClips();
  }

  async searchClips(searchTerm) {
    const query = searchTerm ?
      `{userClips(search:"${searchTerm}"){id,title,author,text}}` :
      '{userClips{id,title,author,text}}';

    const token = UserStore.getToken();
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : null,
      },
      body: JSON.stringify({ query }),
      credentials: 'include',
    });

    const { data } = await resp.json();
    let result;
    if (!data || !data.clips) {
      this.failedClips();
    } else {
      this.updateClips(data.clips);
      result = data.clips;
    }
    return result;
  }

  updateClips(results) {
    return results;
  }

  clearClips() {
    return true;
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
      console.log('Error uploading clips');
    }
  }
}

export default alt.createActions(SearchActions);
