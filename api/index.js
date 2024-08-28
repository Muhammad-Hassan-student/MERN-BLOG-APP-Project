import express from 'express'
import mongoose from 'mongoose';
import colors from 'colors'
import dotenv, { config } from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';

//********************************* CONFIG  ************************** 
//config express
const app=express();
//for the enable requested to api
app.use(express.json());
//for the enable package cookie parser
app.use(cookieParser());
//config dotenv
dotenv.config();


// ----------------------- now make routes -----------------------
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/auth',authRoutes);





// step 1
//make the local host
app.listen(3000,() => {
    console.log("Server  running on port 3000".bgBlue);
});


//======================================= step 2 ============================
//connect to database
mongoose.connect(process.env.MONGO_URL).then(
    () => {
        console.log(`mongoDb is connected successfully`.bgYellow.white);
    }
).catch((err) => {
    console.log(err);
    
})

// ======================================== step 3 ===============================
//test api 
// app.use((req,res) => {
//     res.json("Test api")
// })

// =========================================MiddleWare ============================
app.use((err,req,res,next) => {
    const statusCode= err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })    
})