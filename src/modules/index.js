import { combineReducers } from 'redux';
import clips from './clips';
import user from './user';

export default combineReducers({
  clips,
  user,
});
