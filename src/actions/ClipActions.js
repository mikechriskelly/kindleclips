import alt from '../core/alt';
import fetch from '../core/fetch';
import history from '../core/history';
import UserStore from '../stores/UserStore';

class ClipActions {

  async fetchPrimary(id, isInitial) {
    this.fetching('primary');
    let query;
    // Lookup by ID
    if (id) {
      query = `{clips(id: "${id}")
                {id, title, author, text, similarClips { id, title, author, text}}}`;
    // Get an initial random clip
    } else if (isInitial) {
      // Pick initial clip based on time of day (server and client will make same choice)
      const now = new Date();
      const seed = (now.getUTCDate() * now.getUTCHours()) / (31 * 24);
      query = `{clips(random: true, seed: ${seed})
                {id, title, author, text, similarClips {id, title, author, text}}}`;
    } else {
      // Get random clip
      query = `{clips(random: true)
                {id, title, author, text, similarClips {id, title, author, text}}}`;
    }

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
    if (!data || !data.clips) {
      this.catchError('There was an error loading your clips. Please try again.');
    } else if (data.clips.length === 0) {
      this.catchError('Looks like you don\'t have any clips yet.');
      this.noClips();
    } else {
      const clip = data.clips[0];
      this.updatePrimary(clip);
    }
  }

  async fetchMatching(searchTerm) {
    this.fetching('matching');
    if (!searchTerm) {
      this.fetchPrimary();
      return;
    }

    const query = `{clips(search:"${searchTerm}")
                    {id, title, author, text}}`;
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
    if (data && data.clips) {
      const clips = data.clips;
      this.updateMatching(clips, searchTerm);
    }
  }

  fetching() {
    return true;
  }

  updatePrimary(clip) {
    return clip;
  }

  updateMatching(clips = [], searchTerm = '') {
    return { clips, searchTerm };
  }

  noClips() {
    return true;
  }

  catchError(message = null) {
    return message;
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
