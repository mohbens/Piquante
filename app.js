
// importation de express
const express = require('express');


const mongoose = require('mongoose');
const Sauce = require('./models/sauce');
const path = require('path');
const saucesRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user');

//créer une application express
const app = express();


app.use('/images', express.static(path.join(__dirname, 'images')));

// connection a la BD
mongoose.connect(process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => { console.log('Connexion à MongoDB échouée !'); console.log(err) });
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  app.use(express.json());

  app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes)

module.exports = app;