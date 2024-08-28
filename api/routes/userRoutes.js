import express from "express";
import { deleteUser, updateUser } from "../controller/userController.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

// router.get("/test", (req, res) => {
//     res.json("Hello")
// });

// ====================================== update user profile =============================
router.put('/update/:userId',verifyUser,updateUser)

// ====================================== Delete User ======================================
router.delete('/delete/:userId',verifyUser,deleteUser)


export default router;
