//imporation modèle de la base de donnée :
const Sauce = require('../models/sauce');


exports.likeDislikeSauce = (req, res, next) => { 
   
  //contenu de la requête like dislike envoyé par le navigateur
  const sauceLikeObject = req.body;
  console.log(sauceLikeObject);

  
  //sélection de la sauce (permet l'affichage des likes dislikes sur le front)
  Sauce.findOne({_id: req.params.id})
  
  .then((sauce) => {      
      //like = +1 (like +1)
      let query, message;
      if((!sauce.usersLiked.includes(req.body.userId)) && (req.body.like == 1) ) {
         query = { $inc: {likes : 1}, $push: { usersLiked : req.body.userId}, _id: req.params.id};
         message = "sauce +1 like"
        // Sauce.updateOne({ _id: req.params.id }, { $inc: {likes : 1}, $push: { usersLiked : req.body.userId}, _id: req.params.id})
        //   .then(() => res.status(201).json({ message: "sauce +1 like" }))
        //   .catch((error) => {res.status(400).json({ error })});
      };      
      

      //like = 0 
      if((sauce.usersLiked.includes(req.body.userId)) && (req.body.like == 0) ) {
        query = { $inc: {likes: -1}, $pull: {usersLiked : req.body.userId}, _id: req.params.id}
        message="sauce 0 like" 

        // Sauce.updateOne({_id: req.params.id}, { $inc: {likes: -1}, $pull: {usersLiked : req.body.userId}, _id: req.params.id})
        //   .then(() => res.status(201).json({ message: "sauce 0 like" }))
        //   .catch((error) => {res.status(400).json({ error })});
      }


     //like = -1 (dislike = +1)
     if((!sauce.usersDisliked.includes(req.body.userId)) && (req.body.like == -1) ) {
        query = { $inc: {dislikes : 1}, $push: { usersDisliked : req.body.userId}, _id: req.params.id}
        message = "sauce +1 dislike"
      // Sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes : 1}, $push: { usersDisliked : req.body.userId}, _id: req.params.id})
      //   .then(() => res.status(201).json({ message: "sauce +1 dislike" }))
      //   .catch((error) => {res.status(400).json({ error })});
      }  


      //dislike = 0 *
      if((sauce.usersDisliked.includes(req.body.userId)) && (req.body.like == 0) ) {
        query = { $inc: {dislikes: -1}, $pull: {usersDisliked : req.body.userId}, _id: req.params.id}
        message="sauce 0 like"
      //   Sauce.updateOne({_id: req.params.id}, { $inc: {dislikes: -1}, $pull: {usersDisliked : req.body.userId}, _id: req.params.id})
      //     .then(() => res.status(201).json({ message: "sauce 0 like" }))
      //     .catch((error) => {res.status(400).json({ error })});
      }   
      // let p1;
      // if (req.body.like == 1) {
      //   p1 = 'likes';
      // } else if (req.body.like == -1) {
      //    p1 = 'dislikes';
      // } else {
      //   if (sauce.usersLiked.includes(req.body.userId)) {
      //     p1 = 'likes';
      //   } else if (sauce.dislikes.includes(req.body.userId)) {
      //      p1 = 'dislikes';
      //   } else {
      //     throw Error('User not found');
      //   }
      // }

      //  p1 = sauce.usersLiked.includes(req.body.userId) ? 'likes' : 'dislikes';
      

      // query = { $inc: {p1: -1}, $pull: {usersDisliked : req.body.userId}, _id: req.params.id}

      if(query){
        Sauce.updateOne({_id: req.params.id}, query)
          .then(() => res.status(201).json({ message: message }))
          .catch((error) => {res.status(400).json({ error })});
      } else {
        console.log('Query is undefined')
      }

  })  
  .catch((error) => res.status(404).json({error}));
};