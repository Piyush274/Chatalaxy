import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        required:true
    },
    img:{
        type:String
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[{
        text:{
            type:String,
            required:true,
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    }]
},{timestamps:true,strictPopulate: false})

const Post=mongoose.model("Post",postSchema);

export default Post;
