import alt from '../core/alt';
import fetch from '../core/fetch';
import history from '../core/history';
import UserStore from '../stores/UserStore';

class ClipActions {

  async fetchAll() {
    const query = '{userClips{id,title,author,text}}';
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
    if (!data || !data.userClips) {
      this.catchError('There was an error loading your clips. Please try again.');
    } else {
      const clips = data.userClips;

      // Pick random clip based on time of day (server and client will make same choice)
      const now = new Date();
      const seed = (now.getUTCDate() * now.getUTCHours()) / (31 * 24);
      const clipId = clips[Math.floor(seed * clips.length)].id;
      this.updateAll(clips);
      this.changePrimary(clipId);
      await this.fetchSimilar(clipId);
    }
  }

  async fetchMatching(searchTerm) {
    if (!searchTerm) {
      return;
    }

    const query = `{userClips(search:"${searchTerm}"){id,title,author,text}}`;
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
    if (data && data.userClips) {
      result = data.userClips;
      this.updateMatching(result);
    }
    return;
  }

  async fetchSimilar(clipId) {
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
      this.catchError('There was an error loading your clips. Please try again.');
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

  changePrimary(clipId = null) {
    return clipId;
  }

  catchError(message) {
    return message;
  }

  wipeSearchTerm(confirmed = false) {
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
      this.catchError('Error uploading clips');
    }
  }
}

export default alt.createActions(ClipActions);
