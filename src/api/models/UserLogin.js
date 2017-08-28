import DataType from 'sequelize';
import Model from '../sequelize';

const UserLogin = Model.define('user_login', {
  name: {
    type: DataType.STRING(50),
    primaryKey: true,
  },

  key: {
    type: DataType.STRING(100),
    primaryKey: true,
  },
});

export default UserLogin;
