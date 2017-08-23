import alt from '../core/alt';
import cookie from 'react-cookie';

class UserStore {
  static getToken() {
    return cookie.load('token');
  }

  static isLoggedIn() {
<<<<<<< HEAD
    return this.state.isLoggedIn;
  }

=======
    return !!cookie.load('token');
  }
>>>>>>> full-routing
}

export default alt.createStore(UserStore, 'UserStore');
