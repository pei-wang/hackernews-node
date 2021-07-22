const fs = require("fs");
const path = require("path");
const { ApolloServer } = require("apollo-server");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for Graphql",
  },
];
let idCount = links.length;
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => links.find((item) => item.id === args.id),
  },
  Mutation: {
    post: (parent, args) => {
      const { url, description } = args;
      const newLink = {
        id: `link-${idCount++}`,
        url,
        description,
      };
      links.push(newLink);
      return newLink;
    },
    deleteLink: (parent, args) => {
      const linkToBeDeleted = links.find((item) => item.id === args.id);

      links = links.filter((item) => item.id !== linkToBeDeleted.id);
      return linkToBeDeleted;
    },
    updateLink: (parent, args) => {
      const { id, url, description } = args;

      links = links.map((item) =>
        item.id !== id
          ? item
          : {
              id,
              url: url || item.url,
              description: description || item.description,
            }
      );
      return links.find((item) => item.id === args.id);
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
});

server.listen().then(({ url }) => {
  console.log(`server is running on ${url}`);
});
