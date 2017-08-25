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
 * Generate new slugs for every clip in the database
 * Only used for adding slugs to existing database
 * WARNING: Will overwrite existing slugs and bring user bookmarks
 */
async function generateNewSlugs() {
  // This function only needs to be called to
  try {
    const clips = await Clip.findAll();
    for (const clip of clips) {
      await Clip.update(
        { slug: Clip.generateSlug() },
        { where: { id: clip.dataValues.id } },
      );
    }
  } catch (err) {
    console.log('Failed to add slugs to clips: ', err);
  }
}

async function syncDatabase(...args) {
  await sequelize.sync(...args);
  
  // Only need to run these functions against fresh database
  // Clip.addFullTextIndex();
  // Clip.addIgnoreDuplicateRule();

  return sequelize;
}

export default { syncDatabase };
export { syncDatabase, User, UserLogin, UserClaim, UserProfile, Clip, ClipDist, Topic, TopicProb };
