import ClippingsType from '../types/ClippingsType';
import ClippingsModel from '../models/ClippingsModel';
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
    return ClippingsModel.find(params).exec();
  },
};

export default clippings;
