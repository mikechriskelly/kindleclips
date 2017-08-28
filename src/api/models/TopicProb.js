import DataType from 'sequelize';
import Model from '../sequelize';

const TopicProb = Model.define('topic_prob', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  clipId: {
    type: DataType.UUID,
    unique: 'compositeIndex',
    allowNull: false,
    field: 'clip_id',
  },

  topicId: {
    type: DataType.STRING(10),
    unique: 'compositeIndex',
    allowNull: false,
    field: 'topic_id',
  },

  prob: {
    type: DataType.REAL,
    comment: 'Topic probability',
    allowNull: false,
  },
});

export default TopicProb;
