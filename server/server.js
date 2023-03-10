const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const buildPath = path.join(__dirname, "../client/app");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/app/index.html"));
  });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
});




// const express = require('express');
// const path = require('path');
// const db = require('./config/connection');
// const routes = require('./routes');
// const { ApolloServer } = require('apollo-server-express');
// const { typeDefs, resolvers } = require('./schemas');

// const app = express();
// const PORT = process.env.PORT || 3001;
// const server = new ApolloServer({ typeDefs, resolvers });

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

// async function startApolloServer() {
//   await server.start();

//   server.applyMiddleware({ app });

//   db.once('open', () => {
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}.`);
//       console.log(`🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
//     });
//   });
// }

// startApolloServer();
