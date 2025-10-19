const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLID, GraphQLNonNull } = require("graphql");
const Image = require("../models/Image");

// Тип для Image
const ImageType = new GraphQLObjectType({
  name: "Image",
  fields: () => ({
    id: { type: GraphQLID },
    author: { type: GraphQLString },
    filename: { type: GraphQLString },
    imagePath: { type: GraphQLString },
    uploadDate: { type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    images: {
      type: new GraphQLList(ImageType),
      resolve(parent, args) {
        return Image.find().sort({ uploadDate: -1 });
      },
    },
    image: {
      type: ImageType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Image.findById(args.id);
      },
    },
  },
});

// Mutations (CRUD)
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addImage: {
      type: ImageType,
      args: {
        author: { type: new GraphQLNonNull(GraphQLString) },
        filename: { type: new GraphQLNonNull(GraphQLString) },
        imagePath: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const image = new Image({
          author: args.author,
          filename: args.filename,
          imagePath: args.imagePath,
        });
        return image.save();
      },
    },
    updateImage: {
      type: ImageType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        author: { type: GraphQLString },
        filename: { type: GraphQLString },
        imagePath: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Image.findByIdAndUpdate(
          args.id,
          {
            $set: {
              author: args.author,
              filename: args.filename,
              imagePath: args.imagePath,
            },
          },
          { new: true }
        );
      },
    },
    deleteImage: {
      type: ImageType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Image.findByIdAndDelete(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
