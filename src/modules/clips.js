import history from '../history';

// Constants
const FETCH_CLIP_PENDING = 'FETCH_CLIP_PENDING';
const FETCH_CLIP_FULFILLED = 'FETCH_CLIP_FULFILLED';
const FETCH_CLIP_REJECTED = 'FETCH_CLIP_REJECTED';

// Actions
export function fetchClip(shortId) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch(fetchClipPending());
    // const foo = await getState().cachedClips[shortId];
    try {
      const data = await graphqlRequest(
        `{readClips(shortId: "${shortId}") {shortId, title, author, text, similarClips { shortId, title, author, text }}}`,
      );
      const clip = data.data.readClips[0];
      dispatch(fetchClipFulfilled(clip));
    } catch (errorMsg) {
      console.error(errorMsg);
      dispatch(fetchClipRejected(errorMsg));
    }
  };
}

export function fetchRandomClip() {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch(fetchClipPending());
    try {
      const data = await graphqlRequest(
        `{readClips(random: true) {shortId, title, author, text, similarClips {shortId, title, author, text}}}`,
      );
      const clip = data.data.readClips[0];
      dispatch(fetchClipFulfilled(clip));
    } catch (errorMsg) {
      dispatch(fetchClipRejected(errorMsg));
    }
  };
}

export function fetchClipPending() {
  return {
    type: FETCH_CLIP_PENDING,
  };
}

export function fetchClipFulfilled(clip) {
  return {
    type: FETCH_CLIP_FULFILLED,
    clip,
  };
}

export function fetchClipRejected(errorMsg) {
  return {
    type: FETCH_CLIP_REJECTED,
    errorMsg,
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
  matchingClips: [],
  cachedClips: {},
  searchTerm: null,
  isLoading: false,
  isError: false,
  errorMsg: null,
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
        primaryClip: action.clip,
        cachedClips: {
          ...state.cachedClips,
          // [action.clip.shortId]: action.clip,
        },
        isLoading: false,
        isError: false,
        errorMsg: null,
      };
    }
    case FETCH_CLIP_REJECTED: {
      return {
        ...state,
        isError: true,
        errorMsg: action.errorMsg,
      };
    }
    default:
      return state;
  }
}
