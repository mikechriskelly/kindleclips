import ClipType from '../types/ClipType';
import Clip from '../models/Clip';
import { GraphQLList, GraphQLString, GraphQLID } from 'graphql';
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
    clip.title = (lines[0].match(/(.+?)\((.*?)\)$/) || defaultValue)[1].trim();
    clip.text = lines.slice(2).join('\n').trim();
    clip.author = (lines[0].match(/(.+?)\((.*?)\)$/) || defaultValue)[2].trim();
    clip.userId = userId;
    return clip.text.length ? clip : null;
  });
  return clips.filter(n => n !== null);
}

// Clip Queries
const getOwnClips = {
  type: new GraphQLList(ClipType),
  args: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    text: { type: GraphQLString },
    author: { type: GraphQLString },
    search: { type: GraphQLString },
    userId: { type: GraphQLString },
  },
  resolve: (root, params) => {
    const filter = params;
    if (root.request &&
        root.request.user &&
        root.request.user.id) {
      filter.userId = root.request.user.id;
    } else if (root.request &&
               root.request.headers.authorization &&
               root.request.headers.authorization.split(' ')[0] === 'Bearer') {
      const token = root.request.headers.authorization.split(' ')[1];
      filter.userId = getID(token);
    } else {
      filter.userId = demoUser.id;
    }

    if (filter.hasOwnProperty('search')) {
      // TODO: FTS for Postgres
      filter.$text = { $search: params.search, $language: 'en' };
      delete filter.search;
    }

    try {
      return Clip.findAll({
        attributes: ['id', 'title', 'author', 'text'],
        where: filter,
        limit: 100,
      });
    } catch (err) {
      console.log('Could not retrieve clips.', err);
      return [];
    }
  },
};

async function insertClips(clipFile, userId) {
  const clips = parseMyClippingsTxt(clipFile, userId);
  try {
    await Clip.bulkCreate(clips, { validate: true });
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

export default getOwnClips;
export { insertClips, removeClips };
