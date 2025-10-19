require("dotenv").config();
const mongoose = require("mongoose");

const gamesData = [
  { rawgId: 3498, name: "Grand Theft Auto V", rating: 4.54, price: { amount: 29.99 }, isExplicit: true, isActive: true },
  { rawgId: 3328, name: "The Witcher 3", rating: 4.65, price: { amount: 39.99 }, isExplicit: true, isActive: true },
  { rawgId: 4200, name: "Portal 2", rating: 4.65, price: { amount: 9.99 }, isExplicit: false, isActive: true }
];

(async () => {
  try {
    console.log("Conectando...");
    await mongoose.connect(process.env.MONGODB_URI);
    const collection = mongoose.connection.db.collection("games");
    const result = await collection.insertMany(gamesData);
    console.log("Inseridos: " + result.insertedCount);
    process.exit(0);
  } catch (err) {
    console.log("ERRO: " + err.message);
    process.exit(1);
  }
})();
