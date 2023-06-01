const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Artist = require("./models/artist");
const Music = require("./models/music");
const Albums = require("./models/album");
const User = require("./models/User");
const multer = require("multer");

const upload = multer({
  dest: "./temp",
});
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const album = require("./models/album");

mongoose
  .connect(
    "mongodb+srv://alexisbuffier:KV1couOSVoSaxjeo@musique.rt7yzri.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

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

app.use(bodyParser.json());

// Route pour crée un artiste
app.post("/api/artists", (req, res, next) => {
  const artist = new Artist({
    ...req.body,
  });
  artist
    .save()
    .then(() =>
      res.status(201).json({
        message: "Artiste créée !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
});

// Route pour crée une musique
app.post("/api/music", (req, res, next) => {
  const music = new Music({
    ...req.body,
  });
  music
    .save()
    .then(() =>
      res.status(201).json({
        message: "Music créée !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
});

// Route pour crée un album
app.post("/api/albums", (req, res, next) => {
  const albums = new Albums({
    ...req.body,
  });
  albums
    .save()
    .then(() =>
      res.status(201).json({
        message: "Album créée !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
});

// Route pour crée un utilisateur
app.post("/api/user", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({
            message: "Utilisateur créé !",
          })
        )
        .catch((error) =>
          res.status(400).json({
            error,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
});

// Route de login
app.post("/api/login", (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: "Utilisateur non trouvé !",
        });
      }
      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({
            error: "Mot de passe incorrect !",
          });
        }
        res.status(200).json({
          userId: user._id,
          token: jwt.sign(
            {
              userId: user._id,
            },
            "RANDOM_TOKEN_SECRET",
            {
              expiresIn: "24h",
            }
          ),
        });
      });
    })
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
});

// Route de récupération de toute les musiques quand l'utilisateur est authentifié
app.get("/api/musicToken", (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    if (userId) {
      User.findOne({ _id: userId }).then(() => {
        Music.find()
          .then((music) => res.status(200).json(music))
          .catch((error) =>
            res.status(403).json({
              error,
            })
          );
      });
    } else {
      res.status(401).json({
        error: "Interdit !",
      });
    }
  } else {
    res.status(401).json({
      error: "Interdit !",
    });
  }
});

/*app.get('/api/me', (req, res, next) => {
    console.log(req.body.token)
    res.status(200).json({"token": "toto"})
});*/

// Route pour récupérer toutes les musique
app.get("/api/musics", (req, res, next) => {
  console.log(req.body);
  Music.find()
    .then((music) => res.status(200).json(music))
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
});

// Route pour récupérer tout les artistes
app.get("/api/artists", (req, res, next) => {
  console.log(req.body);
  Artist.find()
    .then((artists) => res.status(200).json(artists))
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
});

// Route pour récupérer tout les albums
app.get("/api/albums", (req, res, next) => {
  console.log(req.body);
  Albums.find()
    .then((albums) => res.status(200).json(albums))
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
});

// Route pour récupérer tout les albums d'un artiste
app.get("/api/artists/:artist_id/albums/", (req, res, next) => {
  console.log(req.params.artist_id);
  Albums.find({ artist_id: req.params.artist_id })
    .then((albums) => res.status(200).json(albums))
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
});

// Route pour récupérer toutes les musiques d'un album
app.get("/api/album/:album_id/music/", (req, res, next) => {
  console.log(req.params.album_id);
  Music.find({ album_id: req.params.album_id })
    .then((musics) => res.status(200).json(musics))
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
});



module.exports = app;
