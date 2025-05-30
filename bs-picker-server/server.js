const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// Schéma du joueur
const playerSchema = new mongoose.Schema({
  tag: String,
  name: String,
  brawlers: Array,
  BattleList: Array,
  date: { type: Date, default: Date.now },
});

const Player = mongoose.model("Player", playerSchema);

app.post("/api/player", async (req, res) => {
  const { tag } = req.body;

  try {
    // 1. Nettoyer le tag (remplacer # par %23 si nécessaire)
    const encodedTag = tag.startsWith("#")
      ? tag.replace("#", "%23")
      : `%23${tag}`;

    // 2. Récupérer les infos joueur
    const playerResponse = await fetch(
      `https://api.brawlstars.com/v1/players/${encodedTag}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BRAWL_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    if (!playerResponse.ok)
      throw new Error("❌ Erreur API Brawl Stars (joueur)");

    const playerData = await playerResponse.json();

    // 3. Récupérer les battle logs
    const battlelogResponse = await fetch(
      `https://api.brawlstars.com/v1/players/${encodedTag}/battlelog`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BRAWL_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    if (!battlelogResponse.ok)
      throw new Error("❌ Erreur API Brawl Stars (battlelog)");

    const battlelogData = await battlelogResponse.json();

    // 4. Supprimer l'entrée précédente
    await Player.deleteOne({ tag: playerData.tag });

    // 5. Créer un nouveau joueur avec les battlelogs
    const player = new Player({
      tag: playerData.tag,
      name: playerData.name,
      brawlers: playerData.brawlers,
      BattleList: battlelogData.items, // ajouter les combats ici
    });

    await player.save();

    res.json({
      message: "✅ Données joueur + combats enregistrées avec succès",
      data: player,
    });
  } catch (err) {
    console.error("Erreur lors du POST /api/player :", err);
    res.status(500).json({ error: "Erreur serveur ou API" });
  }
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur Node.js sur http://localhost:${port}`);
});
