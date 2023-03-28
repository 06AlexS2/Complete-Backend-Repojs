//los schemas de mongoose necesitan la libreria de mongoose
const mongoose = require("mongoose");
//vamos a obtener una clase que se llama schema desde mongoose
const { Schema } = mongoose;

//declarar un nuevo objeto de la clase schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    entityDocument: {
      type: String,
      required: true,
    },
    entityAdress: {
      type: String,
      required: true,
    },
    role : {
      type: String,
      required: true,
      enum: ["owner", "vet", "admin"],
      /* 
        - administrador:  puede loguearse
                          puede hacer cualquier cosa en la API OK
        - veterinaria:    puede loguearse OK
                          puede crear, editar, eliminar, leer mascotas OK
                          puede crear OK, editar OK, eliminar OK, leer OK duenos
                          puede crear OK, leer OK, crear notas aclaratorias consultas
        - dueno:          puede loguearse
                          puede listar consultas OK, puede leer una sola que sea de una mascota propia OK, solo de sus propias mascotas
                          puede listar sus mascotas OK, leer una sola mascota que se propia OK y editar sus propias mascotas OK
      */
    },
    email : {
      type: String,
      required: true,
      validate: {
        validator: (mail) => {
          if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return true;
          }
          return false;
        },
        message: 'Email format is wrong, please verify'
      }
    },
    password: String,
  },
  { timestamps: true, }
);

module.exports = mongoose.model("users", userSchema);
