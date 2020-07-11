const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const stuffCtrl = require('../controllers/stuff')
const multer = require('../middleware/multer-config')

router.get('/', stuffCtrl.getAllSauces) // display sauces, no need to be login
router.get('/:id', auth, stuffCtrl.getOneSauce) // display a sauce
router.post('/', auth, multer, stuffCtrl.createSauce) // create a new sauce
router.put('/:id', auth, multer, stuffCtrl.modifySauce) // change a sauce
router.delete('/:id', auth, stuffCtrl.deleteSauce) // delete a sauce
router.post('/:id/like', auth, stuffCtrl.reactionSauce) // like or dislike a sauce

module.exports = router

// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth')
// const stuffCtrl = require('../controllers/stuff');
// const multer = require('../middleware/multer-config')

// router.get('/', auth, stuffCtrl.getAllStuff);
// router.post('/', auth, multer, stuffCtrl.createThing);
// router.get('/:id', auth, stuffCtrl.getOneThing);
// router.put('/:id', auth, multer, stuffCtrl.modifyThing);
// router.delete('/:id', auth, stuffCtrl.deleteThing);

// module.exports = router;