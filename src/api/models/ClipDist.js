import DataType from 'sequelize';
import Model from '../sequelize';

const ClipDist = Model.define('clip_dist', {
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

  simClipId: {
    type: DataType.UUID,
    unique: 'compositeIndex',
    comment: 'Similar clip',
    allowNull: false,
    field: 'sim_clip_id',
  },

  distance: {
    type: DataType.REAL,
    comment: 'Similarity score',
    allowNull: false,
  },
});

export default ClipDist;
