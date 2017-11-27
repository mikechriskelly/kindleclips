import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import clips from './clips';
import user from './user';

export default combineReducers({
  clips,
  user,
  form: formReducer,
});
