import jwt from "jsonwebtoken";

//Generate a token and set it as a cookie and save it to the browser

export const generateTokenAndSetCookie=(userId,res)=>{
    //from response object res.cookie is used
    
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15d"})
    //Created a token  with payload UserId and ecoded with JWT secret  
    
    //Send as cookie to frontend browser and store it
    res.cookie("jwt",token,{
        maxAge:15*24*60*60*1000, //In millseconds
        httpOnly:true, //Prevents XSS attack cross-site scripting attacks
        sameSite:"strict", //CSRF attacks cross-site request forgery attacks
        secure:process.env.NODE_ENV!=="development", //If not in development mode then secure
    })
}

