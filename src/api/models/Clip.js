import DataType from 'sequelize';
import Model from '../sequelize';

const Clip = Model.define('Clip', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  userId: {
    type: DataType.UUID,
    unique: 'compositeIndex',
    comment: 'Clip Owner',
    allowNull: false,
  },

  hash: {
    type: DataType.BIGINT,
    unique: 'compositeIndex',
    comment: 'Protects against duplicate clips',
    allowNull: false,
  },

  title: {
    type: DataType.STRING(400),
    allowNull: true,
  },

  author: {
    type: DataType.STRING(80),
    allowNull: true,
  },

  text: {
    type: DataType.TEXT,
    allowNull: false,
  },

});

export default Clip;
