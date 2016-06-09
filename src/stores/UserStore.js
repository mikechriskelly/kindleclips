import alt from '../core/alt';
import UserActions from '../actions/UserActions';

class UserStore {

  constructor() {
    this.bindListeners({
      handleLogin: UserActions.LOGIN,
      handleLogout: UserActions.LOGOUT,
    });

    this.state = {
      token: null,
    };
  }

  handleLogin(token) {
    this.state.token = token;
  }

  handleLogout() {
    this.state.token = null;
  }

  static isLoggedIn() {
    return !!this.state.token;
  }

  static getToken() {
    return this.state.token;
  }

}

export default alt.createStore(UserStore, 'UserStore');
