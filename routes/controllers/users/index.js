const router = require("express").Router();
const User = require("./schema");
const { errorHandler, removePassword } = require("../../../util");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const { erase, documentExists, filterEntities } = require("../generics");
const { default: mongoose } = require("mongoose");

const entityRoute = "/";

//entonces, aqui en el codigo de controller owners, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, mascotas (owners)
//listar usuarios
router.get(entityRoute, async (req, res, next) => {
  try {
    const { user = null } = req;
    console.log({ user });
    const filter = filterEntities(User, req.query);
    let result = await User.find(filter);
    result = result.map(removePassword);
    return res.status(200).json(result);
  } catch (error) {
    const err = new createError[500]();
    return next(err);
  }
});

//obtener un solo usuario sigue el mismo metodo que en listar todos los dueños (anterior)
router.get(`${entityRoute}:_id`, async (req, res, next) => {
  try {
    const { _id } = req.params;
    let user = await User.findById(_id);
    if (user) {
      user = removePassword(user);
      return res.status(200).json(user);
    }
    let err = new createError[404]();
    return next(err);
  } catch (error) {
    let err = new createError[500]();
    return next(err);
  }
});

//crear usuarios
const middlewareDocumentExists = documentExists({
  Model: User,
  fields: ["entityDocument", "email"],
});
router.post(entityRoute, middlewareDocumentExists, async (req, res, next) => {
  try {
    if (!User) {
      throw new Error("Model not sent");
    }
    if (!req.body && !Object.keys(req.body).length) {
      let err = new createError[400]("Missing body");
      return next(err);
    }
    //crear y encriptar password con bcrypt
    let { _id, password = null, ...remainingEntityData } = req.body;
    //si se crea password y el campo no está vacio
    if (password && password.length) {
      //con hashSync encriptamos la contraseña, y para ello usamos 8 rondas de encriptación
      password = await bcrypt.hash(password, 8);
      remainingEntityData = { ...remainingEntityData, password };
    }
    console.log(JSON.stringify({ remainingEntityData }, null, 2));
    let user = new User(remainingEntityData);
    await user.save();
    user = removePassword(user);
    return res.status(200).json(user);
  } catch (error) {
    return errorHandler({ error, next });
  }
});

//editar usuarios
const middlewareVerifyDocument = documentExists({
  Model: User,
  fields: ["entityDocument", { operator: "$ne", entName: "_id" }],
});
router.put(
  `${entityRoute}:_id`,
  async (req, res, next) => {
    try {
      const { _id = null } = req.params;
      let { _id: id, password = null, ...newData } = req.body;
      if (!_id) {
        let err = new createError[400]("Missing _id");
        return next(err);
      }
      let user = await User.findById(_id);
      if (!user) {
        let err = new createError[404]();
        return next(err);
      }
      //si se crea password y el campo no está vacio
      if (password && password.length) {
        //con hashSync encriptamos la contraseña, y para ello usamos 8 rondas de encriptación
        password = await bcrypt.hash(password, 8);
        newData = { ...newData, password, _id };
      }
      user.set(newData);
      await user.save();
      user = removePassword(user);
      return res.status(200).json(user);
    } catch (error) {
      if (error.code === 11000) {
        let err = new createError[409](
          `entidad ${JSON.stringify(
            req.body
          )} tiene campos que no permiten duplicación!`
        );
        return next(err);
      }
      let err = new createError[500]();
      return next(err);
    }
  }
);

//eliminar usuarios
const deleteHandler = erase({ Model: User });
router.delete(`${entityRoute}:_id`, deleteHandler);

module.exports = router;
