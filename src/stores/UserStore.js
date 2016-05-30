import alt from '../core/alt';
import UserActions from '../actions/UserActions';

class UserStore {

  constructor() {
    this.bindListeners({
      handleLogin: UserActions.LOGIN_USER,
    });

    this.token = null;

    this.exportPublicMethods({
      isLoggedIn: this.isLoggedIn,
      getUser: this.getUser,
    });
  }

  handleLogin(token) {
    this.token = token;
  }

  isLoggedIn() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  onLogout() {
    this.token = null;
  }

}

export default alt.createStore(UserStore, 'UserStore');
