const fs = require("fs");
const path = require("path");
const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent, args, context) => context.prisma.link.findMany(),
    link: (parent, args) => links.find((item) => item.id === args.id),
  },
  Mutation: {
    post: (parent, args, context) => {
      const { url, description } = args;
      const newLink = context.prisma.link.create({
        data: {
          url,
          description,
        },
      });
      return newLink;
    },
    deleteLink: (parent, args, context) => {
      return prisma.link.delete({ where: { id: parseInt(args.id) } });
    },
    updateLink: (parent, args, context) => {
      const { id, url, description } = args;

      return context.prisma.link.update({
        where: { id: parseInt(id) },
        data: { url: url, description: description },
      });
    },
  },

  // Graphql will infer the resolver
  // Link: {
  //   id: (parent) => parent.id,
  //   description: (parent) => parent.description,
  //   url: (parent) => parent.url,
  // },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => {
  console.log(`server is running on ${url}`);
});
