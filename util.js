const createError = require("http-errors");
const lodash = require("lodash");

const errorHandler = ({error, next}) => {
  let err = null;
  switch (error.name) {
    case "ValidationError":
      const errors = Object.entries(error.errors)
        .map((errorElement) => {
          const message = lodash.get(errorElement, "1.message", "");
          return message;
        })
        .join(" ");
      err = new createError[400](errors);
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

module.exports = {
    errorHandler,
    removePassword,
}
