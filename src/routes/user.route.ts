import express from 'express';
import { loggedInUser, updateUserProfile } from '../controllers/user.controller';
import { protectedRoute } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/current', protectedRoute, loggedInUser);
router.put('/current', protectedRoute, updateUserProfile);

export default router;
