//server/routes/userRoutes.js
import express from 'express';
import { setPassword } from '../controllers/userController.js';


const router = express.Router();

router.post('/set-password', setPassword);

export default router;