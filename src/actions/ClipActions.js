import alt from '../core/alt';
import fetch from '../core/fetch';
import history from '../core/history';
import UserStore from '../stores/UserStore';

class ClipActions {
  async fetchPrimary(slug, random = false) {
    let query;
    this.fetching();

    if (slug) {
      query = `{clips(slug: "${slug}")
                 {id, title, author, text, slug,
                    similarClips {id, title, author, text, slug}}}`;
    } else if (random) {
      query = `{clips(random: true)
                  {id, title, author, text, slug,
                    similarClips {id, title, author, text, slug}}}`;
    } else {
      // Pick initial clip based on time of day (server and client will make same choice)
      const now = new Date();
      const seed = (now.getUTCDate() * now.getUTCHours()) / (31 * 24);
      query = `{clips(random: true, seed: ${seed})
                  {id, title, author, text, slug,
                    similarClips {id, title, author, text, slug}}}`;
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
    let clip = {};
    if (!data || !data.clips) {
      this.catchError('There was an error loading your clips. Please try again.');
    } else if (data.clips.length === 0) {
      this.catchError('Looks like you don\'t have any clips yet.');
      this.noClips();
    } else {
      clip = data.clips[0];
      this.updatePrimary(clip);
    }

    return clip;
  }

  async fetchMatching(searchTerm) {
    history.push(`/s/${searchTerm}`);
    this.fetching();
    if (!searchTerm) {
      this.fetchPrimary();
      return;
    }

    const query = `{clips(search:"${searchTerm}")
                    {id, title, author, text, slug}}`;
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

    let clips = [];
    const { data } = await resp.json();
    if (data && data.clips) {
      clips = data.clips;
      this.updateMatching(clips, searchTerm);
    }

    return clips;
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
