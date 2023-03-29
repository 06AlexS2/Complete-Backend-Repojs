const createError = require("http-errors");
const lodash = require("lodash");
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

const errorHandler = ({error, next}) => {
  console.error(JSON.stringify({error}, null, 2));
  let err = null;
  switch (error.name) {
    case "ValidationError":
      const errors = Object.entries(error.errors)
        .map((errorElement) => {
          const message = lodash.get(errorElement, "1.message", "");
          return message;
        })
        .join(" ");
      err = new createError[40](errors);
      break;
    
    case "TokenExpiredError":
      err = new createError[401](error.message);
      break;
    default:
        err = new createError[500](error.message);
  }
  return next(err);
};

const removePassword = (object) => {
  if(!(typeof object.toJSON === "function")) throw new Error("not a mongoose instance");
  object = object.toJSON();
  //con esto nos aseguramos que en la respuesta JSON no entregue el password
  const {password, ...remainings } = object;
  return remainings;
}

//middleware para verificar si tiene el token activo
const isAuthenticated = (req, res, next) => {
  //si authorization existe en los headers a través del request lo guarda en auth, si no lo pone null
  let auth = lodash.get(req, "headers.authorization", null);
  if (!auth && !auth.length) {
    const err = new createError.Unauthorized("missing token.");
    return next(err);
  }
  const [_bearer, token] = auth.split(" ");
  console.log({ auth, _bearer, token });
  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    if (error) {
      return errorHandler({error, next});
    }
    if (decoded) {
      req.user = decoded;
      next();
    }
  });
};

module.exports = {
    errorHandler,
    removePassword,
    isAuthenticated,
}
