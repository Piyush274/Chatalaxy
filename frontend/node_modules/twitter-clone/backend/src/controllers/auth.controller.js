import User from "../models/user.model.js"
import bcrypt from 'bcryptjs';
import {generateTokenAndSetCookie} from "../lib/utils/generateToken.js"

export const signup=async(req,res)=>{
   try {
    const {fullName,username,email,password}=req.body;

    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!emailRegex.test(email))
    {
      return res.status(400).json({error:"Invalid Email Format"})
    }
    //Same username:username
    //const existingUser=await User.findOne({username:username})
    
    //Check existingUser
    const existingUser=await User.findOne({username:username})
    if (existingUser)
    {
        return res.status(400).json({error:"Username is already taken"})
    }

    //Check existingEmail with database email and email from frontend
    const existingEmail=await User.findOne({email:email})
    if (existingEmail)
    {
        return res.status(400).json({error:"Email already taken"})
    }

    //Hash passwords

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    //Create a new object with User Instance and then save
    //Enables modifications before saving to database

    const newUser=new User({
        fullName:fullName,
        username:username,
        email:email,
        password:hashedPassword,
    })
    
    if(newUser)
    {
     generateTokenAndSetCookie(newUser._id,res)
     await newUser.save();   
    //Send Back details to User
    
    res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        username:newUser.username,
        email:newUser.email,
        followers:newUser.followers,
        following:newUser.following,
        profileImg:newUser.profileImg,
        coverImg:newUser.coverImg,
    })
    }

   } catch (error) {
    console.log("Error in Signup Controller",error.message);
    res.status(500).json({error:"Internal Server Error"});
   }
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

export const login=async(req,res)=>{
   try {

    const {username,password}=req.body;
    const user =await User.findOne({username:username});
    const isPasswordCorrect = await bcrypt.compare(password,user?.password || "") 

    //if not exists compare with empty string to prevent crashing of application

    if(!user || !isPasswordCorrect)
    {
        return res.status(400).json({error:"Invalid username or password"})
    }

    generateTokenAndSetCookie(user._id,res);
    //res is the response object it has many properties like res.status() and res.json()

    res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        username:user.username,
        email:user.email,
        followers:user.followers,
        following:user.following,
        profileImg:user.profileImg,
        coverImg:user.coverImg,
    })

   } catch (error) {
    console.log("Error in Login Controller",error.message);
    res.status(500).json({error:"Internal Server Error"});
   }

}

/*------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

export const logout=async(req,res)=>{
   try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out successfully"})   
     } 
   catch (error) {
    console.log("Error in Logout Controller",error.message);
    res.status(500).json({error:"Internal Server Error"});   
   }
}

/*------------------------------------------------------------------------------------------------------------------------------------------------------------------- */


//Get authenticated user
export const getMe=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id).select("-password");
        res.status(200).json(user); 
    } catch (error) {
        console.log("Error in GetMe Controller",error.message);
        res.status(500).json({error:"Internal Server Error"});   
    }
}