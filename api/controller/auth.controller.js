import bcryptjs from "bcryptjs";
import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUpController = async (req, res , next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
      next(errorHandler(400,'All fields are required'));
  }

  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashPassword,
  });
  try {
    await newUser.save();
    res.json("User sign up successfully");
  } catch (error) {
    next(error);
  }
};

// ================================= sign in controller =================================
export const signInController=async (req,res,next) => {
  const {email,password} = req.body;

  if(!email || !password || email === "" || password === ""){
    return next(errorHandler(400,"All field are required"));
  }
   
  try {
    //check user is sign up or not by email
    const validUser= await User.findOne({email});
    if(!validUser){
      return next(errorHandler(404,"User not found"));
    }

    const validPassword= bcryptjs.compareSync(password,validUser.password);
    if(!validPassword){
      return next(errorHandler(400,"Invalid Password"));
    }
    

    //if everthing is so make the jwt token 
    const token=jwt.sign(
      {
        id:validUser._id
      },process.env.JWT_SECRET
    );

    //for not show password in test api
    
    const {password:pass, ...rest}= validUser._doc;
    res.status(200).cookie('access_token',token,{
      httpOnly:true,
    }).json(rest);
  } catch (error) {
    next(error);
  }
}  