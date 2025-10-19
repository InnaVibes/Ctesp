require("dotenv").config();
const mongoose = require("mongoose");

console.log("1. Conectando...");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("2. Conectado!");
    return mongoose.connection.db.collection("games").countDocuments();
  })
  .then(count => {
    console.log("3. Total de jogos: " + count);
    process.exit(0);
  })
  .catch(err => {
    console.log("ERRO: " + err.message);
    process.exit(1);
  });
