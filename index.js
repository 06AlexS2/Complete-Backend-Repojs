//importar express
require("dotenv").config();
//console.log(process.env);
const express = require("express");
const connection = require("./db");
connection();
const routes = require("./routes");
//definir la variable app como funcion express y el puerto
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded());

routes(app);

app.listen(port, () => {
  console.log(`vet app listening at http://localhost:${port}`);
});
