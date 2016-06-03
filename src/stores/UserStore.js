import alt from '../core/alt';
import UserActions from '../actions/UserActions';

class UserStore {

  constructor() {
    this.bindListeners({
      handleLogin: UserActions.LOGIN_USER,
    });

    this.state = {
      token: null,
    };
  }

  handleLogin(token) {
    this.setState({ token });
  }

  static isLoggedIn() {
    return !!this.token;
  }

  static onLogout() {
    this.token = null;
  }
}

export default alt.createStore(UserStore, 'UserStore');
