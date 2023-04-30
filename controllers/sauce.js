const Sauce = require('../models/sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  console.log('****************sauceObject._userId)************************')
  console.log(sauceObject.userId)
  console.log(req.auth)
  console.log('****************sauceObject._userId)**************')


  // sauceObject: {"name":"aze","manufacturer":"aze","description":"aze","mainPepper":"aze","heat":1,"userId":"643a9a4b40f602960fa87416"}


  sauceObject.userId = req.auth.userId;
  sauceObject.imageUrl = `${req.file.filename}`;
  const sauce = new Sauce(sauceObject);


  // delete sauceObject.userId;
  // // sauceObject: {"name":"aze","manufacturer":"aze","description":"aze","mainPepper":"aze","heat":1}
  // const sauce = new Sauce({
  //   ...sauceObject,
  //   userId: req.auth.userId,
  //   // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  //   imageUrl: `${req.file.filename}`

  // });
  
  console.log(req.file.filename);
  sauce.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
    .catch(error => { res.status(400).json({ error }) })
};


exports.getOneSauce = (req, res, next) => {

  Sauce.findOne({

    _id: req.params.id
  }).then(
    (sauce) => {

    // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      sauce.imageUrl= `${req.protocol}://${req.get('host')}/images/${sauce.imageUrl}`
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

exports.modifySauce = (req, res, next) => {

  
  console.log('***************sauceObject111*********************')
  console.log(req.body)
  console.log('****************sauceObject111**********************')

  const sauceObject = req.file ? {

    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.file.filename}`,   
  } : { ...req.body };
 

  console.log('***************sauceObject*********************')
  console.log(sauceObject.imageUrl)
  console.log('****************sauceObject**********************')

  
  delete sauceObject;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {


        
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => {
            if (sauce.imageUrl !== sauceObject.imageUrl){
              // unlink sauce.imageUrl

              fs.unlink(`images/${sauce.imageUrl}`, async () => {
                  // .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                  // .catch(error => res.status(401).json({ error }));
              });
    
            }
           return res.status(200).json({ message: 'Objet modifié!' })
          })
          .catch(error => res.status(401).json({ error }));
          
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = sauce.imageUrl;
        console.log("************filename*************")
        console.log(filename)
        console.log(sauce.imageUrl)


        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getAllStuff = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      for(let i=0; i<sauces.length ;i++){
        sauces[i].imageUrl= `${req.protocol}://${req.get('host')}/images/${sauces[i].imageUrl}`
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