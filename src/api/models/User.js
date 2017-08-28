import DataType from 'sequelize';
import Model from '../sequelize';

const User = Model.define(
  'user',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },

    email: {
      type: DataType.STRING(256),
      validate: { isEmail: true },
    },

    emailConfirmed: {
      type: DataType.BOOLEAN,
      defaultValue: false,
      field: 'email_confirmed',
    },
  },
  {
    indexes: [{ fields: ['email'] }],
  },
);

export default User;
