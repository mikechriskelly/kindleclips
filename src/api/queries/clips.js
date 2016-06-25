import ClipType from '../types/ClipType';
import Clip from '../models/Clip';
import { GraphQLList, GraphQLString, GraphQLID } from 'graphql';
import { demoUser } from '../../config';
import { getID } from '../auth';

/* eslint-disable no-console */

// Helper Functions
function generateGUID(str) {
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

function parseMyClippingsTxt(clipFile, clipOwner) {
  const seperator = '==========';
  const clips = clipFile.split(seperator).map(section => {
    const lines = section.trim().split(/\r?\n/);
    const defaultValue = ['', '', ''];

    const clip = {};
    clip.id = generateGUID(section);
    clip.title = (lines[0].match(/(.+?)\((.*?)\)$/) || defaultValue)[1].trim();
    clip.text = lines.slice(2).join('\n').trim();
    clip.author = (lines[0].match(/(.+?)\((.*?)\)$/) || defaultValue)[2].trim();
    clip.clipowner = clipOwner;
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
    clipowner: { type: GraphQLString },
  },
  resolve: (root, params) => {
    const filter = params;
    if (root.request &&
        root.request.user &&
        root.request.user.id) {
      filter.clipowner = root.request.user.id;
    } else if (root.request &&
               root.request.headers.authorization &&
               root.request.headers.authorization.split(' ')[0] === 'Bearer') {
      const token = root.request.headers.authorization.split(' ')[1];
      filter.clipowner = getID(token);
    } else {
      filter.clipowner = demoUser.id;
    }

    if (filter.hasOwnProperty('search')) {
      filter.$text = { $search: params.search, $language: 'en' };
      delete filter.search;
    }

    return Clip
      .find(filter, { score: { $meta: 'textScore' } })
      .limit(100)
      .exec();
  },
};

function insertClips(clipFile, clipowner) {
  const clips = parseMyClippingsTxt(clipFile, clipowner);
  Clip.collection.insert(clips, { keepGoing: true }, err => {
    if (!err) {
      console.log('Clips were successfully stored.');
    }
  });
}

function removeClips(clipowner) {
  Clip.collection.remove({ clipowner }, err => {
    if (err) {
      console.log(err);
    } else {
      console.log('Clips were successfully removed.');
    }
  });
}

export default getOwnClips;
export { insertClips, removeClips };
