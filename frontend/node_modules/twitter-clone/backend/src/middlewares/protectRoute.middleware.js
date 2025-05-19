import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

//Verify the cookie with the save cookie for authentication without need to login again

export const protectRoute =async(req,res,next)=>{

    try {

        //Retrieves the JWT token stored in req.cookies.jwt.
        const token=req.cookies.jwt;     
        if(!token)
        {
            return res.status(401).json({error:"You need to login first : Unauthorized No token provided"})
        }
        
        //Verify the token with the secret key
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded)
        {
            return res.status(401).json({error:"Unautorised: Invalid token"})
        }
        
        //Payload data from req.cookies which has userId and password is removed
        const user=await User.findById(decoded.userId).select("-password");

        if(!user)
        {
            return res.status(404).json({error:"User Not found"});
        }
        // In request object new user property is assigned
        req.user=user;
        next();

    } 
    catch (error) 
    {
        console.log("Error in Protected Route Middleware",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}