const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const mongoose = require("mongoose");
const categorie = require("./models/categorie");

mongoose
  .connect(
    "mongodb+srv://esn:castres81@cluster0.7vtsq.mongodb.net/DB:musique?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

module.exports = app;
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-RequestedWith, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-AllowMethods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.get("/api/artists", (req, res, next) => {
  console.log(req.params.articleId);
  const artists = ["artistes"];
  res.status(200).json(artists);
});

app.get("/api/artists/:artistId/albums", (req, res, next) => {
  const albums = ["album", "album2"];
  res.status(200).json(albums);
});

app.get("/api/artists/:artistId/musiques", (req, res, next) => {
  const musiques = ["musique", "musique2"];
  res.status(200).json(musiques);
});

app.post("/api/artists", (req, res, next) => {
  console.log(req.body.nom);
  res.status(201).json("Créé");
});

app.post("/api/artists/:artistId/albums", (req, res, next) => {
  console.log(req.body.nom);
  res.status(201).json("Créé");
});

app.post("/api/categorie", (req, res, next) => {
  const categorie = new Categorie({
    ...req.body,
  });
  categorie
    .save()
    .then(() =>
      res.status(201).json({
        message: "Categorie créée !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
});
