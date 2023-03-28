const router = require("express").Router();
const Vet = require("./schema");

const {
  create,
  list,
  getOne,
  update,
  erase,
  documentExists,
} = require("../generics");

const entityRoute = "/";

//entonces, aqui en el codigo de controller vets, solo se llama a una variable que a su vez
//llama a listar de los metodos genericos (recordemos que listEntities fue renombrado a list para facilitar su uso)
//const listHandler = list(entity);

//y ya cuando queramos crear el enrutador de metodo listar, solo llamamos a la variable anterior y le damos la ruta de entidad
//correspondiente, en este caso, veterinarios (vets)
//listar veterinarios
const listHandler = list({ Model: Vet });
router.get(entityRoute, listHandler);

//obtener un solo veterinario sigue el mismo metodo que en listar todos los dueños (anterior)
const getOneHandler = getOne({ Model: Vet });
router.get(`${entityRoute}:_id`, getOneHandler);

//crear veterinarios
const createHandler = create({ Model: Vet });
//vamos a crear un handler para verificar que no hayan 2 vets con el mismo numero de licencia
/*cuando hacemos un router como el de abajo, express.js automaticamente nos permite definir funciones intermedias,
mejor conocidas como middleware, que pueden ser ejecutadas después de una acción en especifico.
i.e. router.get(entity, middleware1, middleware2, handler)
*/
const middlewareDocumentExists = documentExists({
  Model: Vet,
  fields: ["entityDocument"],
});
router.post(entityRoute, middlewareDocumentExists, createHandler);

//editar veterinarios
const updateHandler = update({ Model: Vet });
const middlewareEntityID = documentExists({
  Model: Vet,
  fields: ["entityDocument", { operator: "$ne", entName: "_id" }],
});
router.put(`${entityRoute}:_id`, middlewareEntityID, updateHandler);

//eliminar veterinarios
const deleteHandler = erase({ Model: Vet });
router.delete(`${entityRoute}:_id`, deleteHandler);

module.exports = router;
