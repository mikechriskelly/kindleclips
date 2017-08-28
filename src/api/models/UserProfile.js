import DataType from 'sequelize';
import Model from '../sequelize';

const UserProfile = Model.define('user_profile', {
  userId: {
    type: DataType.UUID,
    primaryKey: true,
    field: 'user_id',
  },

  displayName: {
    type: DataType.STRING(100),
    field: 'display_name',
  },

  picture: {
    type: DataType.STRING(256),
  },

  gender: {
    type: DataType.STRING(50),
  },

  location: {
    type: DataType.STRING(100),
  },

  website: {
    type: DataType.STRING(256),
  },
});

export default UserProfile;
