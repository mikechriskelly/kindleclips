import ClippingsType from '../types/ClippingsType';
import Clippings from '../models/Clippings';
import { GraphQLList, GraphQLString, GraphQLID } from 'graphql';

const clippings = {
  type: new GraphQLList(ClippingsType),
  args: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    text: { type: GraphQLString },
    author: { type: GraphQLString },
  },
  resolve: (root, params, options) => {
    return Clippings.find(params).exec();
  },
};

export default clippings;
