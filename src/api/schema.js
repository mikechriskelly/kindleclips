import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import content from './queries/content';
import { userClips, singleClip, similarClips } from './queries/clips';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      content,
      userClips,
      singleClip,
      similarClips,
    },
  }),
});

export default schema;
