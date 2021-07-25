const fs = require("fs");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const { execute, subscribe } = require("graphql");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { pubsub } = require("./pubsub");

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
};

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

(async function () {
  const prisma = new PrismaClient();
  const PORT = 4000;
  const app = express();
  const httpServer = createServer(app);

  // graphql http server
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
        pubsub,
        userId: req && req.headers.authorization ? getUserId(req) : null,
      };
    },
  });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
