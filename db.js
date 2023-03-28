const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db connection successful");
  } catch (error) {
    console.log("error while connecting to db");
    console.log(error);
  }
};

module.exports = connection;
