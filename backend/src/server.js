import express from "express"
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from 'cloudinary';
import path from "path";

import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import notificationRoute from "./routes/notification.route.js"
import dbConnect from "./db/dbConnect.js";
import exp from "constants";

// Configuration to connect cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express()
const port = process.env.PORT || 5000

const _dirname = path.resolve(); //We will get direct path of folder 


//To get json from frontend through req body
app.use(express.json({limit:"5mb"}))  //Increase limit when payload(data) is large

//If value is too large it can crashed due to denial of service(DOS)

//To get json via form data
app.use(express.urlencoded({extended:true}))

//To get cookies from browser
app.use(cookieParser());

app.use('/api/auth',authRoute)

app.use('/api/user',userRoute)

app.use('/api/post',postRoute)

app.use('/api/notification',notificationRoute)

app.use(express.static(path.join(_dirname,"/frontend/dist")))

//Serve all frontend files instead other than backend apis
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  dbConnect();
})