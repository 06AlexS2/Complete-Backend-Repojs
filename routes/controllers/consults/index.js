const router = require("express").Router();
const Consult = require("./schema");
const Vet = require("../vets/schema");
const Pet = require("../pets/schema");
const createError = require("http-errors");

const {
  create, list, getOne,
  update,
  erase,
  filterEntities,
} = require("../generics");

const entityRoute = "/";

//entonces, aqui en el codigo de controller consults, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, consultas (consults)
//listar consultas
const listHandler = list({Model: Consult, populate: ["pet", "vet"]});
router.get(entityRoute, listHandler);

//obtener una sola consulta sigue el mismo metodo que en listar todas (anterior)
const getOneHandler = getOne({Model: Consult});
router.get(`${entityRoute}:_id`, getOneHandler);

//crear consultas
const createHandler = create({Model: Consult});
router.post(entityRoute, async (req, res) => {
  const {pet = null, vet = null} = req.body;
  const vetExists = await Vet.exists({_id: vet});
  const petExists = await Pet.exists({_id: pet});
  if(vetExists && petExists) {
    //este ya tiene el response ahi, con este objeto que le pasamos se encarga de devolver la respuesta
    return createHandler(req, res);
  }
  if (!vetExists) {
    const err = new createError[400](
      `Vet with _id ${JSON.stringify(veterinaria)} not found!`
    );
    return next(err);
  }
  if (!petExists) {
    const err = new createError[400](
      `Pet with _id ${JSON.stringify(veterinaria)} not found!`
    );
    return next(err);
  }
});

//editar consultas
const updateHandler = update({Model: Consult});
router.put(`${entityRoute}:_id`, updateHandler);

//eliminar consultas
const deleteHandler = erase({ Model: Consult });
router.delete(`${entityRoute}:_id`, deleteHandler);

module.exports = router;

//continuar con la referencia de veterinarios y mascotas
