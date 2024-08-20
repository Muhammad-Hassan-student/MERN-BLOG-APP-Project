import express from 'express'
import { signInController, signUpController } from '../controller/auth.controller.js';


const router=express.Router();

// ============================ sign up routes ===================================
router.post('/signUp',signUpController);

// ============================= sign in routes =================================
router.post('/signIn',signInController);










export default router;