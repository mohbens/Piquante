const Sauce = require('../models/sauce');
const fs = require('fs');

// creer une sauce pour le POST
exports.createSauce = (req, res, next) => {
const sauceObject = JSON.parse(req.body.sauce);
  sauceObject.userId = req.auth.userId;
  sauceObject.imageUrl = `${req.file.filename}`;
  const sauce = new Sauce(sauceObject);
  sauce.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
    .catch(error => { res.status(400).json({ error }) })
};

// faire un GET pour une Sauce 
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${sauce.imageUrl}`
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};


// pour modifier la sauce avec PUT
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {  /*si la modification contient une image */
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.file.filename}`,
  } : { ...req.body };
  delete sauceObject;
  
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: 'Forbidden' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => {
            if (sauce.imageUrl !== sauceObject.imageUrl) {
              fs.unlink(`images/${sauce.imageUrl}`, async () => { }); /*on supprime l'ancienne image du dossier image */
            }
            return res.status(200).json({ message: 'Objet modifié!' })
          })
          .catch(error => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};


// supprimer la sauce avec delete
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: 'Forbidden' });
      } else {
        const filename = sauce.imageUrl;
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(500).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(404).json({ error });
    });
};


// pour gerer les boutons like et dislike 

exports.likeDislikeSauce = (req, res, next) => {

  //contenu de la requête like dislike envoyé par le navigateur
  const sauceLikeObject = req.body;
  console.log(sauceLikeObject);

  //sélection de la sauce (permet l'affichage des likes dislikes sur le front)
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //like = +1 (like +1)
      let query, message;
      if ((!sauce.usersLiked.includes(req.body.userId)) && (req.body.like == 1)) {
        query = { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id };
        message = "sauce +1 like"
      };
      //like = 0 
      if ((sauce.usersLiked.includes(req.body.userId)) && (req.body.like == 0)) {
        query = { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id }
        message = "sauce 0 like"
      }
      //like = -1 (dislike = +1)
      if ((!sauce.usersDisliked.includes(req.body.userId)) && (req.body.like == -1)) {
        query = { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id }
        message = "sauce +1 dislike"
      }
      //dislike = 0 *
      if ((sauce.usersDisliked.includes(req.body.userId)) && (req.body.like == 0)) {
        query = { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id }
        message = "sauce 0 like"
      }

      if (query) {
        Sauce.updateOne({ _id: req.params.id }, query)
          .then(() => res.status(201).json({ message: message }))
          .catch((error) => { res.status(400).json({ error }) });
      } else {
        message = "action deja faite "
        throw message //401
      }
    })
    .catch((error) => res.status(401).json({ error }));
};



// afficher toutes les sauces 
exports.getAllStuff = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      for (let i = 0; i < sauces.length; i++) {
        sauces[i].imageUrl = `${req.protocol}://${req.get('host')}/images/${sauces[i].imageUrl}`
      }
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};