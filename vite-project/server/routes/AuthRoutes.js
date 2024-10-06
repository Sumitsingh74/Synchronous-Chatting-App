import { Router } from "express";
import { signup , login ,userInfo ,updateProfile ,profile_Image , removeProfileImage} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";


import multer from "multer";

// // Set up storage for uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Specify the directory to save uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Save the file with a unique name
//   },
// });

// // Initialize multer with the storage configuration
// const upload = multer({ storage });


const authRoutes= Router();

const upload =multer({dest:"uploads/profiles/"});

authRoutes.post("/signup",signup);
authRoutes.post("/login",login);
authRoutes.get("/userInfo",verifyToken,userInfo);
authRoutes.post("/update_profile",verifyToken,updateProfile);

authRoutes.post("/profile_Image",verifyToken,upload.single("profile-image"),profile_Image);

authRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage);



export default authRoutes;