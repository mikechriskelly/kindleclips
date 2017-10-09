import fetch from 'isomorphic-fetch';

// Actions
const GET_SINGLE_CLIP = 'GET_SINGLE_CLIP';
// const GET_RANDOM_CLIP = 'GET_RANDOM_CLIP';
// const SEARCH_CLIPS = 'SEARCH_CLIPS';
const RECEIVE_CLIP = 'RECEIVE_CLIP';
// const RECEIVE_MATCHING = 'RECEIVE_MATCHING';
const IS_LOADING = 'IS_LOADING';
const IS_ERROR = 'IS_ERROR ';

// Initial State
const initialState = {
  isLoading: false,
  searchTerm: null,
  primaryClip: null,
  similarClips: [],
  matchingClips: [],
  cachedClips: {},
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_SINGLE_CLIP: {
      return state;
    }
    case RECEIVE_CLIP: {
      return {
        ...state,
        primaryClip: action.clip,
      };
    }
    case IS_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
      };
    }
    case IS_ERROR: {
      return {
        ...state,
        isError: action.isError,
      };
    }
    default:
      return state;
  }
}

// Helper Functions
function fetchQuery(query) {
  return fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // Authorization: token ? `Bearer ${token}` : null,
    },
    body: JSON.stringify({ query }),
    credentials: 'include',
  });
}

// Action Creators
export function getSingleClip(slug) {
  return async dispatch => {
    dispatch(isLoading(true));

    const query = `{clips(slug: "${slug}") {
        id, title, author, text, slug, similarClips 
          { id, title, author, text, slug }
      }}`;

    // const token = UserStore.getToken();
    const response = await fetchQuery(query);
    const { data } = await response.json();
    if (!data || !data.clips || data.clips.length === 0) {
      dispatch(isError(true));
    } else {
      const clip = data.clips[0];
      dispatch(recieveClip(clip));
    }
    dispatch(isLoading(false));
  };
}

export function recieveClip(clip) {
  return {
    type: RECEIVE_CLIP,
    clip,
  };
}

export function isLoading(bool) {
  return {
    type: IS_LOADING,
    isLoading: bool,
  };
}

export function isError(bool) {
  return {
    type: IS_ERROR,
    isError: bool,
  };
}
