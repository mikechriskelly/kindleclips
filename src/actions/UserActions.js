import alt from '../core/alt';

class UserActions {
  login(token) {
    return token;
  }
  logout() {
    return true;
  }
}

export default alt.createActions(UserActions);
