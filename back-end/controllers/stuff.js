const Sauce = require('../models/sauce')
const fs = require('fs')


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    sauceObject.likes = 0
    sauceObject.dislikes = 0
    sauceObject.usersLiked = []
    sauceObject.usersDisliked = []
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }))
}


exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body }
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifiée !' }))
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`,
                () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimée !' }))
                        .catch(error => res.status(400).json({ error }))
                })
        })
        .catch(error => res.status(500).json({ error }))
}


exports.reactionSauce = (req, res) => {
    const sauceLiked = req.file ? {
        ...JSON.parse(req.body.sauce),
    } : {...req.body };
    const like = sauceLiked.like;
    const userId = sauceLiked.userId
    if (like == 1) {
        Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: 1 },
                $push: { usersLiked: userId },
                $pull: { usersDisliked: userId }
            })
            .then(() => res.status(200).json({ message: 'like +1' }))
            .catch(error => res.status(400).json({ error }))
    } else if (like == -1) {
        Sauce.updateOne({ _id: req.params.id }, {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: userId },
                $pull: { usersLiked: userId },
            })
            .then(() => res.status(200).json({ message: 'dislike +1' }))
            .catch(error => res.status(400).json({ error }))
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                const userDislikedDelete = sauce.usersDisliked.includes(userId)
                if (userDislikedDelete == true) {
                    Sauce.updateOne({ _id: req.params.id }, {
                            $pull: { usersDisliked: userId },
                            $inc: { dislikes: -1 }
                        })
                        .then(() => res.status(200).json({ message: 'dislike -1' }))
                        .catch(error => res.status(400).json({ error }))
                } else {
                    Sauce.updateOne({ _id: req.params.id }, {
                            $pull: { usersLiked: userId },
                            $inc: { likes: -1 }
                        })
                        .then(() => res.status(200).json({ message: 'like -1' }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
    }
};


// const Thing = require('../models/things');
// const fs = require('fs')

// exports.createThing = (req, res, next) => {
//     const thingObject = JSON.parse(req.body.thing);
//     delete thingObject._id;
//     const thing = new Thing({
//         ...thingObject,
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     });
//     thing.save()
//         .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
//         .catch(error => res.status(400).json({ error }));
// };

// exports.getOneThing = (req, res, next) => {
//     Thing.findOne({ _id: req.params.id })
//         .then(thing => res.status(200).json(thing))
//         .catch(error => res.status(404).json({ error }))
// }

// exports.modifyThing = (req, res, next) => {
//     const thingObject = req.file ? {
//         ...JSON.parse(req.body.thing),
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     } : {...req.body };
//     Thing.updateOne({ _id: req.params.id }, {...thingObject, _id: req.params.id })
//         .then(() => res.status(200).json({ message: 'Objet modifié !' }))
//         .catch(error => res.status(400).json({ error }));
// };

// exports.deleteThing = (req, res, next) => {
//     Thing.findOne({ _id: req.params.id })
//         .then(thing => {
//             const filename = thing.imageUrl.split('/images/')[1];
//             fs.unlink(`images/${filename}`, () => {
//                 Thing.deleteOne({ _id: req.params.id })
//                     .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
//                     .catch(error => res.status(400).json({ error }));
//             });
//         })
//         .catch(error => res.status(500).json({ error }));
// };

// exports.getAllStuff = (req, res, next) => {
//     Thing.find()
//         .then(things => res.status(200).json(things))
//         .catch(error => res.status(400).json({ error }))
// }