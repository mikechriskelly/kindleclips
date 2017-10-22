// Constants
const FETCH_CLIP_PENDING = 'FETCH_CLIP_PENDING';
const FETCH_CLIP_FULFILLED = 'FETCH_CLIP_FULFILLED';
const FETCH_CLIP_REJECTED = 'FETCH_CLIP_REJECTED';

// Actions
export function fetchClip(slug) {
  return (dispatch, getState, graphqlRequest) => {
    dispatch(fetchClipPending());
    graphqlRequest(
      `{clips(slug: "${slug}") {id, title, author, text, slug, similarClips { id, title, author, text, slug }}}`,
    ).then(data => {
      dispatch(fetchClipFulfilled(data));
    });
  };
}

export function fetchRandomClip() {
  return (dispatch, getState, graphqlRequest) => {
    dispatch(fetchClipPending());
    graphqlRequest(
      `{clips(random: true) {id, title, author, text, slug, similarClips {id, title, author, text, slug}}}`,
    ).then(data => {
      dispatch(fetchClipFulfilled(data));
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

// Initial State
const initialState = {
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
