const router = require("express").Router();
const User = require("./schema");
const { errorHandler, removePassword } = require("../../../util");
const createError = require("http-errors");

const {
  erase,
  documentExists,
  filterEntities
} = require("../generics");
const { default: mongoose } = require("mongoose");

const entityRoute = "/";

//entonces, aqui en el codigo de controller owners, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, mascotas (owners)
//listar dueños
router.get(entityRoute, async (req, res, next) => {
    try {
      const filter = filterEntities(User, req.query);
      let result = await User.find(filter);
      result = result.map(removePassword);
      return res.status(200).json(result);
    } catch (error) {
      const err = new createError[500]();
      return next(err);
    }
  });

//obtener un solo duño sigue el mismo metodo que en listar todos los dueños (anterior)
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

//crear dueños
const middlewareDocumentExists = documentExists({
  Model: User,
  fields: ["entityDocument"],
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
    const { _id, ...remainingEntityData } = req.body;
    let user = new User(remainingEntityData);
    await user.save();
    user = removePassword(user);
    return res.status(200).json(user);
  } catch (error) {
    return errorHandler({ error, next });
  }
});

//editar dueños
const middlewareVerifyDocument = documentExists({
  Model: User,
  fields: ["entityDocument", { operator: "$ne", entName: "_id" }],
});
router.put(
  `${entityRoute}:_id`,
  middlewareVerifyDocument,
  async (req, res, next) => {
    try {
      const { _id = null } = req.params;
      const { _id: id, ...newData } = req.body;
      if (!_id) {
        let err = new createError[400]("Missing _id");
        return next(err);
      }
      let user = await User.findById(_id);
      if (!user) {
        let err = new createError[404]();
        return next(err);
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

//eliminar dueños
const deleteHandler = erase({ Model: User });
router.delete(`${entityRoute}:_id`, deleteHandler);

module.exports = router;
