import alt from '../core/alt';
import UserActions from '../actions/UserActions';
import cookie from 'react-cookie';

class UserStore {

  constructor() {
    this.bindListeners({
      handleLogin: UserActions.LOGIN,
      handleLogout: UserActions.LOGOUT,
    });

    this.state = {
      token: cookie.load('token'),
      isLoggedIn: !!cookie.load('token'),
    };
  }

  handleLogin() {
    this.state.token = cookie.load('token');
    this.state.isLoggedIn = !!cookie.load('token');
  }

  handleLogout() {
    cookie.remove('token');
    this.state.token = null;
    this.state.isLoggedIn = false;
  }

  static getToken() {
    return this.state.token || cookie.load('token');
  }

  static isLoggedIn() {
    return this.state.isLoggedIn;
  }

}

export default alt.createStore(UserStore, 'UserStore');
