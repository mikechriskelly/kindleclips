// Initial State
export const initialState = {
  id: null,
  email: null,
  isLoggedIn: false,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
