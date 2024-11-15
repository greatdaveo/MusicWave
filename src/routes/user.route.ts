import express from 'express';
import { loggedInUser } from '../controllers/user.controller';

const router = express.Router();

router.get('/current', loggedInUser);

export default router;
