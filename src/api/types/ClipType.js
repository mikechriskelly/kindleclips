import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const ClipType = new ObjectType({
  name: 'Clip',
  fields: {
    id: { type: new NonNull(ID) },
    title: { type: StringType },
    author: { type: StringType },
    text: { type: new NonNull(StringType) },
    clipowner: { type: new NonNull(StringType) },
  },
});

export default ClipType;
