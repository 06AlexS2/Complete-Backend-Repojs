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
  },
  { timestamps: true, }
);

module.exports = mongoose.model("users", userSchema);
