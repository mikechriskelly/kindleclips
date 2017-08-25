import DataType from 'sequelize';
import Model from '../sequelize';

const Topic = Model.define('topic', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  userId: {
    type: DataType.UUID,
    unique: 'compositeIndex',
    allowNull: false,
    field: 'user_id',
  },

  topicId: {
    type: DataType.INTEGER,
    unique: 'compositeIndex',
    allowNull: false,
    field: 'topic_id',
  },

  name: {
    type: DataType.STRING(100),
    allowNull: false,
  },

});

export default Topic;
