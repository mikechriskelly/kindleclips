import alt from '../core/alt';
import fetch from '../core/fetch';
import history from '../core/history';
import UserStore from '../stores/UserStore';

class ClipActions {

  async fetch() {
    this.search(null, true);
  }

  async search(searchTerm, updateAll = false) {
    if (!searchTerm && !updateAll) {
      this.random();
      return searchTerm;
    }

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
      this.updateFail('There was an error loading your clips. Please try again.');
    } else {
      result = data.userClips;
      if (updateAll) this.updateAll(result);
      if (searchTerm) {
        this.updateMatching(result);
      } else {
        this.random();
      }
    }
    return searchTerm;
  }

  async similar(clipId) {
    const query = `{similarClips(id:"${clipId}"){id,title,author,text}}`;
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
    if (!data || !data.similarClips) {
      this.updateFail('There was an error loading your clips. Please try again.');
    } else {
      result = data.similarClips;
      this.updateSimilar(result);
    }
  }

  updateAll(clips) {
    return clips;
  }

  updateMatching(clips) {
    return clips;
  }

  updateSimilar(clips) {
    return clips;
  }

  updateSingle(clipId) {
    return clipId;
  }

  updateFail(message) {
    return message;
  }

  random() {
    return true;
  }

  clearSearch(confirmed) { 
    return confirmed;
  }

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
      setTimeout(() => history.push('/'), 2200);
    } else {
      console.log('Error uploading clips');
    }
  }
}

export default alt.createActions(ClipActions);
