const pets = require("./controllers/pets");
const owners = require("./controllers/owners");
const vets = require("./controllers/vets");
const consults = require("./controllers/consults");
const users = require("./controllers/users");

module.exports = (app) => {
  app.use("/pets", pets);
  app.use("/owners", owners);
  app.use("/vets", vets);
  app.use("/consults",consults);
  app.use("/users", users);
};
