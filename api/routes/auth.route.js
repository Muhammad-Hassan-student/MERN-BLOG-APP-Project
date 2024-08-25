import express from 'express'
import { google, signInController, signUpController } from '../controller/auth.controller.js';


const router=express.Router();

// ============================ sign up routes ===================================
router.post('/signUp',signUpController);

// ============================= sign in routes =================================
router.post('/signIn',signInController);

// ============================ Google Sign up / Sign in ========================
router.post('/google',google);









export default router;