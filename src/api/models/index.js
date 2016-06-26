import sequelize from '../sequelize';
import User from './User';
import UserLogin from './UserLogin';
import UserClaim from './UserClaim';
import UserProfile from './UserProfile';
import Clip from './Clip';

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

User.hasMany(Clip, {
  foreignKey: 'userId',
  as: 'clips',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

async function syncDatabase(...args) {
  await sequelize.sync(...args);
  try {
    await Clip.addFullTextIndex();
  } catch (err) {
    console.log('Full Text Index already added.');
  }
  return sequelize;
}

export default { syncDatabase };
export { syncDatabase, User, UserLogin, UserClaim, UserProfile, Clip };
