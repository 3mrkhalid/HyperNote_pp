const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController")
const verifyJWT = require('../middleware/verifyJWT')
const verifyAdmin = require('../middleware/verifyAdmin')

router.use(verifyJWT)
router.route("/")
  .get(verifyAdmin, usersController.getAllUsers);
router.route("/me").get(usersController.me)
module.exports = router;