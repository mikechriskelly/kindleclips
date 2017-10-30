import history from '../history';

// Constants
const FETCH_CLIP_PENDING = 'FETCH_CLIP_PENDING';
const FETCH_CLIP_FULFILLED = 'FETCH_CLIP_FULFILLED';
const FETCH_CLIP_REJECTED = 'FETCH_CLIP_REJECTED';
const UPLOAD_CLIPS_PENDING = 'UPLOAD_CLIPS_PENDING';
const UPLOAD_CLIPS_FULFILLED = 'UPLOAD_CLIPS_FULFILLED';
const UPLOAD_CLIPS_REJECTED = 'UPLOAD_CLIPS_REJECTED';

// Thunk Actions
export function fetchClip(shortId) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch(fetchClipPending());

    // In case no ID provided, pick an initial clip based on time of day (server and client will make same choice)
    const now = new Date();
    const seed = now.getUTCDate() * now.getUTCHours() / (31 * 24);
    const query = shortId
      ? `{readClips(shortId: "${shortId}") {shortId, title, author, text, similarClips { shortId, title, author, text }}}`
      : `{readClips(random: true, seed: ${seed}) {shortId, title, author, text, similarClips { shortId, title, author, text }}}`;

    // const foo = await getState().cachedClips[shortId];
    try {
      const data = await graphqlRequest(query);
      const clip = data.data.readClips[0];
      dispatch(fetchClipFulfilled(clip));
    } catch (errorMsg) {
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

      // Update URL to match randomly fetched clip
      const clipURL = `/c/${clip.shortId}`;
      if (history.location.pathname !== clipURL) {
        history.replace(clipURL);
      }
    } catch (errorMsg) {
      dispatch(fetchClipRejected(errorMsg));
    }
  };
}

export function uploadClips(files) {
  // TODO: Get this old code working
  return async (dispatch, getState, { fetch }) => {
    dispatch(uploadClipsPending());
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
      dispatch(uploadClipsFulfilled());
    } else {
      dispatch(uploadClipsRejected('Error uploading clips'));
    }
  };
}

// Regular Actions
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

export function uploadClipsPending() {
  return {
    type: UPLOAD_CLIPS_PENDING,
  };
}

export function uploadClipsFulfilled() {
  return {
    type: UPLOAD_CLIPS_FULFILLED,
  };
}

export function uploadClipsRejected(errorMsg) {
  return {
    type: UPLOAD_CLIPS_REJECTED,
    errorMsg,
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
        isLoading: false,
        isError: true,
        errorMsg: action.errorMsg,
      };
    }
    case UPLOAD_CLIPS_PENDING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case UPLOAD_CLIPS_FULFILLED: {
      return {
        ...state,
        isLoading: false,
        isError: false,
        errorMsg: null,
      };
    }
    case UPLOAD_CLIPS_REJECTED: {
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMsg: action.errorMsg,
      };
    }
    default:
      return state;
  }
}
