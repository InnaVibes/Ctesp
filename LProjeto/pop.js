require("dotenv").config();
const mongoose = require("mongoose");

const gamesData = [
  { rawgId: 3498, name: "Grand Theft Auto V", rating: 4.54, price: { amount: 29.99 }, isExplicit: true, isActive: true },
  { rawgId: 3328, name: "The Witcher 3", rating: 4.65, price: { amount: 39.99 }, isExplicit: true, isActive: true },
  { rawgId: 4200, name: "Portal 2", rating: 4.65, price: { amount: 9.99 }, isExplicit: false, isActive: true },
  { rawgId: 5286, name: "Tomb Raider", rating: 4.41, price: { amount: 19.99 }, isExplicit: true, isActive: true },
  { rawgId: 12020, name: "Left 4 Dead 2", rating: 4.44, price: { amount: 6.99 }, isExplicit: true, isActive: true },
  { rawgId: 13536, name: "Portal", rating: 4.59, price: { amount: 9.99 }, isExplicit: false, isActive: true },
  { rawgId: 4291, name: "CS:GO", rating: 4.32, price: { amount: 0 }, isExplicit: false, isActive: true },
  { rawgId: 5679, name: "Skyrim", rating: 4.48, price: { amount: 19.99 }, isExplicit: false, isActive: true },
  { rawgId: 802, name: "Borderlands 2", rating: 4.51, price: { amount: 19.99 }, isExplicit: true, isActive: true },
  { rawgId: 28, name: "Red Dead 2", rating: 4.62, price: { amount: 59.99 }, isExplicit: true, isActive: true }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const col = mongoose.connection.db.collection("games");
    await col.deleteMany({});
    const res = await col.insertMany(gamesData);
    console.log("OK: " + res.insertedCount);
    process.exit(0);
  } catch (e) {
    console.log("ERRO: " + e.message);
    process.exit(1);
  }
})();
