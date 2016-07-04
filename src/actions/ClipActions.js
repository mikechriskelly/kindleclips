import alt from '../core/alt';
import fetch from '../core/fetch';
import history from '../core/history';
import UserStore from '../stores/UserStore';

class ClipActions {

  /**
   * Fetch all clips for current user. Used on page load.
   * Effect: Calls ClipAction search
   */
  async fetch() {
    return await this.search();
  }

  /**
   * Search for matching clips
   * @param  {string} searchTerm - Search words from search box
   * Effect: Calls ClipAction update
   */
  async search(searchTerm) {
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
    if (!data || !data.userClips) {
      this.fail();
    } else {
      this.update(data.userClips);
      result = data.userClips;
    }
    return result;
  }

  update(results) {
    return results;
  }

  clear() {
    return true;
  }

  fail() {
    return true;
  }

  /**
   * Upload clips to database
   * @param  {object} containing one text file
   * Effects: Redirects to home page
   */
  async upload(files) {
    // Put UI in loading state while processing file
    history.push('/uploading');
    const formData = new FormData();
    formData.append('myClippingsTxt', files[0]);

    const resp = await fetch('/api/clips/upload', {
      method: 'post',
      body: formData,
      credentials: 'include',
    });

    if (resp.status === 200) {
      fetch('/api/clips/analyze', {
        method: 'get',
        credentials: 'include',
      });
      // Delayed redirect to ensure DB returns new results
      setTimeout(() => history.push('/'), 1000);
    } else {
      console.log('Error uploading clips');
    }
  }
}

export default alt.createActions(ClipActions);
