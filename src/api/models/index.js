import sequelize from '../sequelize';
import User from './User';
import UserLogin from './UserLogin';
import UserClaim from './UserClaim';
import UserProfile from './UserProfile';
import Clip from './Clip';
import ClipDist from './ClipDist';
import Topic from './Topic';
import TopicProb from './TopicProb';

User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserClaim, {
  foreignKey: 'userId',
  as: 'claims',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(Topic, {
  foreignKey: 'userId',
  as: 'topics',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(Clip, {
  foreignKey: 'userId',
  as: 'clips',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Clip.hasMany(TopicProb, {
  foreignKey: 'clipId',
  as: 'clips',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Clip.hasMany(ClipDist, {
  foreignKey: ['clipId', 'simClipId'],
  as: 'distances',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

async function syncDatabase(...args) {
  await sequelize.sync(...args);
  Clip.addFullTextIndex();
  Clip.addIgnoreDuplicateRule();
  return sequelize;
}

export default { syncDatabase };
export { syncDatabase, User, UserLogin, UserClaim, UserProfile, Clip, ClipDist, Topic, TopicProb };
