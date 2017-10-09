import cookie from 'react-cookie';
import alt from '../alt';

class UserStore {
  static getToken() {
    return cookie.load('token');
  }

  static isLoggedIn() {
    return !!cookie.load('token');
  }
}

export default alt.createStore(UserStore, 'UserStore');
