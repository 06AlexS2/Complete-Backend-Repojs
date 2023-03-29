const router = require("express").Router();
const User = require("../users/schema");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const SECRET_KEY = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const { default: mongoose } = require("mongoose");
const { errorHandler, jwtSignPromise } = require("../../../util");

const entityRoute = "/";

//iniciar sesión
router.post(entityRoute, async (req, res, next) => {
  try {
    //el request espera password e email
    const { password = null, email = null } = req.body;
    let err = new createError[400]("wrong email or password");
    //si ambos campos llegan al body del request
    if (password && password.length > 0 && email && email.length > 0) {
      //busca un usuario que contenga los campos del body
      let user = await User.findOne({ email });
      //si no hay usuario que haga match con esos campos, tira error y detiene el request
      if (!user) {
        return next(err);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid === true) {
        //logica para cuando el usuario hizo inicio de sesion correctamente
        //volver el usuario plano con toJSON
        user = user.toJSON();
        //removemos el password del resto de datos de usuario para evitar filtraciones
        const { password, ...userData } = user;
        const token = await jwtSignPromise({
          data: userData,
          secret: SECRET_KEY,
          options: { expiresIn: 60 * 60 },
        });
        //y enviamos la respuesta con el token generado y el resto de datos de usuario sin la contraseña
        const response = { token, user: userData };
        return res.status(200).json(response);
      }
      return next(err);
    }
  } catch (error) {
    return errorHandler({ error, next });
  }
});

module.exports = router;
