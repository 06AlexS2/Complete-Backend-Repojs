const pets = require("./controllers/pets");
const consults = require("./controllers/consults");
const users = require("./controllers/users");
const login = require("./controllers/login");
const { isAuthenticated } = require("../util");

module.exports = (app) => {
  app.use("/login", login);
  app.use(isAuthenticated);
  app.use("/pets", pets);
  app.use("/consults", consults);
  app.use("/users", users);
};
