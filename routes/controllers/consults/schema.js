//los schemas de mongoose necesitan la libreria de mongoose
const mongoose = require("mongoose");
//vamos a obtener una clase que se llama schema desde mongoose
const { Schema } = mongoose;

//declarar un nuevo objeto de la clase schema
const consultSchema = new Schema(
  {
    pet: {
      type: "ObjectId",
      ref: "pets",
      required: true,
    },
    vet: {
      type: "ObjectId",
      ref: "vets",
      required: true,
    },
    record: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("consults", consultSchema);
