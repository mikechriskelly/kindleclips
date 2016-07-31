import ClipType from '../types/ClipType';
import Clip from '../models/Clip';
import { GraphQLList, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLFloat } from 'graphql';
import { demoUser } from '../../config';
import { getID } from '../auth';

/* eslint-disable no-console */

/**
 * Generate a hash number from a text string
 * @param  {string} str - Unparsed string of onw clip
 * @return {number} hash - Number to use as unique field
 */
function hashText(str) {
  let i = str.length;
  let hash = 5381;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

/**
 * Parse My Clippings.txt
 * @param  {string} clipFile - String of My Clippings.txt
 * @param  {string} userId - Clip owner
 * @return {array} clips - Array of clip objects
 */
function parseMyClippingsTxt(clipFile, userId) {
  const seperator = '==========';
  const clips = clipFile.split(seperator).map(section => {
    const lines = section.trim().split(/\r?\n/);
    const defaultValue = ['', '', ''];

    const clip = {};
    clip.hash = hashText(section);
    clip.title = (lines[0].match(/(.+?)\((.*?)\)$/) || defaultValue)[1].trim().substring(0, 400);
    clip.text = lines.slice(2).join('\n').trim();
    clip.author = (lines[0].match(/(.+?)\((.*?)\)$/) || defaultValue)[2].trim().substring(0, 120);
    clip.userId = userId;
    return clip.text.length ? clip : null;
  });
  return clips.filter(n => n !== null);
}

/**
 * Get User Id via query credentials
 * @param  {object} root - Root variable object from client query
 * @return {string} userId
 */
function getUserId(root) {
  let userId = demoUser.id;

  if (root.request &&
      root.request.user &&
      root.request.user.id) {
    userId = root.request.user.id;
  } else if (root.request &&
             root.request.headers.authorization &&
             root.request.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = root.request.headers.authorization.split(' ')[1];
    userId = getID(token);
  }
  return userId;
}

// Clip Query: All Clips for Current User
const clips = {
  type: new GraphQLList(ClipType),
  args: {
    id: { type: GraphQLID },
    search: { type: GraphQLString },
    random: { type: GraphQLBoolean },
    seed: { type: GraphQLFloat },
  },
  resolve: (root, args) => {
    const userId = getUserId(root);
    const limit = 50;
    const attributes = ['id', 'title', 'author', 'text'];

    if (args.id) {
      return Clip.findAll({
        attributes,
        where: { userId, id: args.id },
        limit: 1,
      });
    }

    if (args.search) return Clip.search(userId, args.search, limit);
    if (args.random) return Clip.getRandom(userId, args.seed);
    return [];
  },
};

async function insertClips(clipFile, userId) {
  const newClips = parseMyClippingsTxt(clipFile, userId);
  try {
    await Clip.bulkCreate(newClips, { validate: false });
    console.log('Clips inserted.');
    return true;
  } catch (err) {
    console.log('Some write operations failed. Usually due to duplicates.', err);
    return false;
  }
}

async function removeClips(userId) {
  try {
    await Clip.destroy({ where: { userId } });
    console.log('Clips removed.');
    return true;
  } catch (err) {
    console.log('Could not remove clips.', err);
    return false;
  }
}

export default clips;
export { clips, insertClips, removeClips };
