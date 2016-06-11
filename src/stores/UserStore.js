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
      isLoggedIn: false,
    };
  }

  handleLogin(token) {
    this.state.token = token;
    this.state.isLoggedIn = true;
  }

  handleLogout() {
    this.state.token = null;
    this.state.isLoggedIn = false;
  }

  static getToken() {
    return this.state.token;
  }

}

export default alt.createStore(UserStore, 'UserStore');
