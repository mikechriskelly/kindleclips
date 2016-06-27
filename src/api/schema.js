import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import content from './queries/content';
import { userClips, singleClip } from './queries/clips';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      content,
      userClips,
      singleClip,
    },
  }),
});

export default schema;
