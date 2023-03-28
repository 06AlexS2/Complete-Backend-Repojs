const router = require("express").Router();

const { create, list, getOne, update, erase } = require("../generics");

const entityRoute = "/";
const entity = "owners";

//entonces, aqui en el codigo de controller owners, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, dueños (owners)
//listar dueños
router.get(entityRoute, listHandler);

//obtener una sola mascota sigue el mismo metodo que en listar todas las dueños (anterior)
const getOneHandler = getOne(entity);
router.get(`${entityRoute}:_id`, getOneHandler);

//crear dueños
const createHandler = create(entity);
router.post(entityRoute, createHandler);

//editar dueños
const updateHandler = update(entity);
router.put(`${entityRoute}:_id`, updateHandler);

//eliminar dueños
const eraseHandler = erase(entity);
router.delete(`${entityRoute}:_id`, eraseHandler);

module.exports = router;
