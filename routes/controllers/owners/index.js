const router = require("express").Router();
const Owner = require("./schema");

const { create, list, getOne, update, erase, filterEntities } = require("../generics");

const entityRoute = "/";

//entonces, aqui en el codigo de controller owners, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, mascotas (owners)
//listar dueños
const listHandler = list({Model: Owner});
router.get(entityRoute, listHandler);

//obtener un solo duño sigue el mismo metodo que en listar todos los dueños (anterior)
const getOneHandler = getOne({Model: Owner});
router.get(`${entityRoute}:_id`, getOneHandler);

//crear dueños
const createHandler = create({Model: Owner});
router.post(entityRoute, createHandler);

//editar dueños
const updateHandler = update({Model: Owner});
router.put(`${entityRoute}:_id`, updateHandler);

//eliminar dueños
const deleteHandler = erase({ Model: Owner });
router.delete(`${entityRoute}:_id`, deleteHandler);

module.exports = router;
