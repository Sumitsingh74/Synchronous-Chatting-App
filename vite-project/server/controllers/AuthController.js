// import { response } from "express";  // Not needed

import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import { renameSync, unlinkSync } from "fs";



// Set the max token age (3 days in milliseconds)
const maxAge = 3 * 24 * 60 * 60;  // Expressed in seconds for `expiresIn`

// Create token
const createToken = (email, userId) => {
  const userData = {
    email: email,
    userId: userId,
  };

  // Ensure `JWT_KEY` is set in the environment
  return jwt.sign(userData, process.env.JWT_KEY, { expiresIn: maxAge });
};

// Signup handler
export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    // Check if email and password are provided
    if (!email || !password) {
      console.log("Empty field");
      return response.status(400).send("Email and Password are required");
    }

    // Create the user in the database (you might want to hash the password here)
    const user = await User.create({ email, password });

    // After creating the user, create a token
    const token = createToken(user.email, user._id);

    // Set token in response (usually you would send it as a cookie or in the body)
    response.cookie("jwt", token, { 
        httpOnly: true,
        maxAge: maxAge,
        secure:true,
        sameSite:"None",
     });

    // Send success response
    return response.status(201).json({ user: {
      usrId: user._id,
      email:user.email,
      profileSetup:user.profileSetup,
    }, token });

  } catch (err) {
    console.log(err);
    return response.status(500).send("Internal Server Error");
  }
};

export const login = async (request, response, next) => {
    try {
      const { email, password } = request.body;
  
      // Check if email and password are provided
      if (!email || !password) {
        console.log("Empty field");
        return response.status(400).send("Email and Password are required");
      }
  
      // Create the user in the database (you might want to hash the password here)
      const user = await User.find({ email, password });

      if(!user){
        return response.status(404).send("Email and Password is Incorrect");
      }

      const auth = await compare(password,user.password);

      if(!auth){
        return response.status(400).send("Password is Incorrect");
      }
  
      // After creating the user, create a token
      const token = createToken(user.email, user._id);
  
      // Set token in response (usually you would send it as a cookie or in the body)
      response.cookie("jwt", token, { 
          httpOnly: true,
          maxAge: maxAge,
          secure:true,
          sameSite:"None",
       });
  
      // Send success response
      return response.status(200).json({ user:{
        usrId: user._id,
      email:user.email,
      profileSetup:user.profileSetup,
      firstName:user.firstName,
      lastName:user.lastName,
      image:user.image
      } });
  
    } catch (err) {
      console.log(err);
      return response.status(500).send("Internal Server Error");
    }
  };





  export const userInfo = async (request, response, next) => {
    try {
      console.log(request.userId);

      const userData =await User.findById(request.userId);

      if(!userData){
        return response.status(404).send("User with the given id not found");
      }
  
      // Send success response
      return response.status(200).json({
        usrId: userData._id,
      email:userData.email,
      profileSetup:userData.profileSetup,
      firstName:userData.firstName,
      lastName:userData.lastName,
      image:userData.image
      });
  
    } catch (err) {
      console.log(err);
      return response.status(500).send("Internal Server Error");
    }
  };


  export const updateProfile = async (request, response, next) => {
    try {
      console.log(request.userId);

      const {userId}= request;
      const {firstName,lastName,color} =request.body;

      if(!firstName||!lastName){
        return response.status(400).send("FirsatName LastName and color is required");
      }

      const userData =await User.findByIdAndUpdate(userId,{
        firstName,lastName,colour,profileSetup:true
      },{new :true,runValidators:true});
  
      // Send success response
      return response.status(200).json({
        usrId: userData._id,
      email:userData.email,
      profileSetup:userData.profileSetup,
      firstName:userData.firstName,
      lastName:userData.lastName,
      image:userData.image
      });
  
    } catch (err) {
      console.log(err);
      return response.status(500).send("Internal Server Error");
    }
  };

  


  export const profile_Image = async (request, response, next) => {
    try {

      if(!request.file){
      return response.status(400).send("File is required.");
      }
    
      const date = Date.now();
      let fileName = "uploads/profiles/" + date + request.file.originalname;
      renameSync(request.file.path, fileName);
    
      const updatedUser = await User.findByIdAndUpdate(
        request.userId,
        { image: fileName },
        { new: true, runValidators: true }
      );
  
      // Send success response
      return response.status(200).json({
      image:updatedUser.image
      });
  
    } catch (err) {
      console.log(err);
      return response.status(500).send("Internal Server Error");
    }
  };

  

  export const removeProfileImage = async (request, response, next) => {
    try {
      console.log(request.userId);

      const {userId}= request;
      
      const user = await User.findById(userId);

      if(!user){
        return response.status(404).send("Internal Server Error.");
      }

      if(user.image){
        unlinkSync(user.image);
      }

      user.image=null;
      await user.save();
  
      // Send success response
      return response.status(200).send("Profile image removed  successfully");
  
    } catch (err) {
      console.log(err);
      return response.status(500).send("Internal Server Error");
    }
  };