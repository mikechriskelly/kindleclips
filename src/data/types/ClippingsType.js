import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const ClippingsType = new ObjectType({
  name: 'ClippingsItem',
  fields: {
    id: { type: ID },
    title: { type: StringType },
    author: { type: StringType },
    text: { type: StringType },
  },
});

export default ClippingsType;
