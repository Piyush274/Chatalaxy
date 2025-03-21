import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },

    //Followers and Following Fields: These fields should store an array of ObjectIds instead of just one
    
    followers:[{
        type:mongoose.Schema.Types.ObjectId, //Stores the IDs of users who follow the current user.
        ref:"User", //Tells Mongoose that each ObjectId in the array references a document in the "User" collection
        default:[] //O followers when signup
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[] //O following when signup
    }],
    profileImg:{
        type:String,
        default:" ", //empty
    },
    coverImg:{
        type:String,
        default:" ",
    },
    bio:{
        type:String,
        default:" ",
    },
    link:{
        type:String,
        default:" ",
    },

    //Array of liked posts
    likedPosts:[{
        type:mongoose.Schema.ObjectId,
        ref:"Post",
        default:[], //No liked post by default
        }],
},{timestamps:true})

const User=mongoose.model("User",userSchema);
//In mongoose users will be created
export default User;