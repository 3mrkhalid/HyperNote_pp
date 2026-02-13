import express from 'express';

const router = express.Router();

import usersController from'../controllers/usersController.js'
import verifyJWT from '../middleware/verifyJWT.js';
import verifyAdmin from '../middleware/verifyAdmin.js';


router.use(verifyJWT)
router.route("/")
  .get(verifyAdmin, usersController.getAllUsers);
router.route("/me").get(usersController.me)


export default router;