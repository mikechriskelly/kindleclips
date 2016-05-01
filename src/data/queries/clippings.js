import ClippingsType from '../types/ClippingsType';
import Clippings from '../models/Clippings';
import { GraphQLList, GraphQLString, GraphQLID } from 'graphql';

const clippings = {
  type: new GraphQLList(ClippingsType),
  args: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    text: { type: GraphQLString },
    author: { type: GraphQLString },
    search: { type: GraphQLString },
  },
  resolve: (root, params, options) => {

    const filter = params.hasOwnProperty('search') ?
      { $text: { $search: params.search, $language: 'en' } }
      : params;

    return Clippings
      .find(filter, { score: { $meta: 'textScore' } })
      .limit(10)
      .exec();
  },
};

export default clippings;
