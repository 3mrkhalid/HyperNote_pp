import express from 'express'
import authController from '../controllers/authController.js'
import { authLimiter } from '../middleware/RateLimit.js';

const router = express.Router();

router.route('/register').post(authLimiter, authController.register)
router.route('/login').post(authLimiter, authController.login)
router.route('/logout').post(authController.logout)
router.route('/refresh').get(authController.refresh)

export default router;