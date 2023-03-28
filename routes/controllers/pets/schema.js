//los schemas de mongoose necesitan la libreria de mongoose
const mongoose = require("mongoose");
//vamos a obtener una clase que se llama schema desde mongoose
const { Schema } = mongoose;

//declarar un nuevo objeto de la clase schema
const petSchema = new Schema(
  {
    petType: String,
    petName: {
      type: String,
      required: true,
    },
    owner: {
      type: "ObjectId",
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("pets", petSchema);
