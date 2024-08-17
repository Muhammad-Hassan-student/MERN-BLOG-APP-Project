import express from 'express'
import { signUpController } from '../controller/auth.controller.js';


const router=express.Router();


router.post('/signUp',signUpController);












export default router;