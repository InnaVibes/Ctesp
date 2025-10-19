require("dotenv").config();
const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const col = mongoose.connection.db.collection("games");
    
    console.log("Adicionando slug...");
    
    await col.updateMany({}, {$set: {
      slug: "game-slug"
    }});
    
    console.log("✅ Pronto!");
    process.exit(0);
  } catch (e) {
    console.log("ERRO: " + e.message);
    process.exit(1);
  }
})();
