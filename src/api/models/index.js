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
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(Clip, {
  foreignKey: 'userId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Clip.hasMany(TopicProb, {
  foreignKey: 'clipId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Clip.belongsToMany(Clip, {
  as: 'sim_clip',
  through: ClipDist,
  foreignKey: 'clipId',
  otherkey: 'simClipId',
});

/**
 * Generate new short IDs for every clip in the database
 * Only used for adding short IDs to existing database
 * WARNING: Will overwrite existing short IDs and break user bookmarks
 */
async function generateNewShortId() {
  try {
    const clips = await Clip.findAll();
    clips.map(clip => {
      Clip.update(
        { shortId: Clip.generateShortId() },
        { where: { id: clip.dataValues.id } },
      );
      return true;
    });
  } catch (err) {
    console.error('Failed to add short ID to clips: ', err);
  }
}

async function sync(...args) {
  await sequelize.sync(...args);

  // Only need to run these functions against fresh database
  // Clip.addFullTextIndex();
  // Clip.addIgnoreDuplicateRule();

  return sequelize;
}

export default { sync };
export {
  sync,
  User,
  UserLogin,
  UserClaim,
  UserProfile,
  Clip,
  ClipDist,
  Topic,
  TopicProb,
  generateNewShortId,
};
