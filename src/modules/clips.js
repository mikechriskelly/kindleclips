import history from '../history';

// Constants
const FETCH_CLIP_PENDING = 'FETCH_CLIP_PENDING';
const FETCH_CLIP_FULFILLED = 'FETCH_CLIP_FULFILLED';
const FETCH_CLIP_REJECTED = 'FETCH_CLIP_REJECTED';

// Actions
export function fetchClip(shortId) {
  return (dispatch, getState, { graphqlRequest }) => {
    dispatch(fetchClipPending());
    graphqlRequest(
      `{readClips(shortId: "${shortId}") {shortId, title, author, text, similarClips { shortId, title, author, text }}}`,
    ).then(data => {
      const clip = data.data.readClips ? data.data.readClips[0] : null;
      dispatch(fetchClipFulfilled(clip));
    });
  };
}

export function fetchRandomClip() {
  return (dispatch, getState, { graphqlRequest }) => {
    dispatch(fetchClipPending());
    graphqlRequest(
      `{readClips(random: true) {shortId, title, author, text, similarClips {shortId, title, author, text}}}`,
    ).then(data => {
      const clip = data.data.readClips ? data.data.readClips[0] : null;
      dispatch(fetchClipFulfilled(clip));
    });
  };
}

export function fetchClipPending() {
  return {
    type: FETCH_CLIP_PENDING,
  };
}

export function fetchClipFulfilled(data) {
  return {
    type: FETCH_CLIP_FULFILLED,
    data,
  };
}

export function fetchClipRejected() {
  return {
    type: FETCH_CLIP_REJECTED,
  };
}

export function uploadClips(files) {
  // TODO: Get this old code working
  return (dispatch, getState, { fetch }) => {
    dispatch(fetchClipPending());

    // Put UI in loading state while processing file
    history.push('/uploading');
    const formData = new FormData();
    formData.append('myClippingsTxt', files[0]);

    const resp = fetch('/api/clips/upload', {
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
  };
}

// Initial State
const initialState = {
  primaryClip: {},
  primaryClipID: null,
  similarClipIDs: [],
  matchingClipIDs: [],
  clips: {},
  searchTerm: null,
  isLoading: false,
  isError: false,
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_CLIP_PENDING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case FETCH_CLIP_FULFILLED: {
      return {
        ...state,
        primaryClip: action.data,
        isLoading: false,
        isError: false,
      };
    }
    case FETCH_CLIP_REJECTED: {
      return {
        ...state,
        isError: true,
      };
    }
    default:
      return state;
  }
}
