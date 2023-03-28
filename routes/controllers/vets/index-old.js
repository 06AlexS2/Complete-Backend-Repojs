const router = require("express").Router();

const { create, list, getOne, update, erase } = require("../generics");

const entityRoute = "/";
const entity = "vets";

//entonces, aqui en el codigo de controller vets, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, veterinarias (vets)
//listar veterinarias
router.get(entityRoute, listHandler);

//obtener una sola mascota sigue el mismo metodo que en listar todas las veterinarias (anterior)
const getOneHandler = getOne(entity);
router.get(`${entityRoute}:_id`, getOneHandler);

//crear veterinarias
const createHandler = create(entity);
router.post(entityRoute, createHandler);

//editar veterinarias
const updateHandler = update(entity);
router.put(`${entityRoute}:_id`, updateHandler);

//eliminar veterinarias
const eraseHandler = erase(entity);
router.delete(`${entityRoute}:_id`, eraseHandler);

module.exports = router;
