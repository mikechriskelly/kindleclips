import alt from '../core/alt';
import cookie from 'react-cookie';

class UserStore {
  static getToken() {
    return cookie.load('token');
  }

  static isLoggedIn() {
    return !!cookie.load('token');
  }
}

export default alt.createStore(UserStore, 'UserStore');
