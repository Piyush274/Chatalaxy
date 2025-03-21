import User from "../models/user.model.js"
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';

export const getUserProfile =async(req,res)=>{

    const {username}=req.params;

    try {
        const user=await User.findOne({username:username}).select("-password");
        if (!user)
        {
            return res.status(404).json({error:"User not found"});
        }
        res.status(200).json(user)

    } catch (error) {   
        console.log("Error in getUserProfile",error.message);
        res.status(500).json({error:error.message});
    }
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

export const followUnfollowUser=async(req,res)=>{
    
    try 
    {
        const {id}=req.params;

        const userToModify=await User.findById(id); //Id to follow which is clicked

        const currentUser=await User.findById(req.user._id) //Id from which followed or clicked(coming from middleware)
    
        if (id===req.user._id.toString()) //Converting Object to String
          {
            return res.status(400).json({error:"You can't follow/unfollow yourself"});
          }
        
        if (!userToModify || !currentUser)
          {
            return  res.status(400).json({error:"User not found"});
          }

        const isFollowing=currentUser.following.includes(id); //Following functionality

        if(isFollowing)
          {
            //Unfollow the User
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
            res.status(200).json({message:"User Unfollowed Successfully"});
          }
        else
        {
           //Follow the User
           await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
           await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});

           //Send the notifications to the User
           const newNotification=new Notification({
             type:"follow",
             from:req.user._id,
             to:userToModify._id,
           })

           await newNotification.save();

           //To do return the id of the user as a response 
           res.status(200).json({message:"User followed Successfully"});
        }

    }

    catch (error) 
    {
        console.log("Error in followUnfollowUser",error.message);
        res.status(500).json({error:error.message});
    }
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

export const getSuggestUser=async(req,res)=>{
    try
    {
      const userId=req.user._id;
      
      const userFollowedByMe=await User.findById(userId).select("following");

      const users=await User.aggregate([
        {
            $match:{
                _id:{$ne:userId} //not equal to
            }
        },
        {
            $sample:{size:10} //randwomly selects 10 users from filtered result and will filtere more to get only 4
        }
      ]);

      const filteredUsers=users.filter((user)=>!userFollowedByMe.following.includes(user._id))

      /*It filters out the users who are already followed by the current user and creates a new list, 
      filteredUsers, that only contains users not followed by the current user.*/

      const suggestedUsers=filteredUsers.slice(0,4);

      suggestedUsers.forEach((user)=>(user.password=null));

      res.status(200).json(suggestedUsers);
    } 
    catch (error)
    {
        console.log("Erro in getSuggestedUsers:",error.message);
        res.status(500).json({error:error.message});
    }
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

export const updateUserProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link, profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
      let user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Check if both currentPassword and newPassword are provided
      if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
          return res.status(400).json({ error: "Please provide both current password and new password" });
      }

      // Update password if both currentPassword and newPassword are provided
      if (currentPassword && newPassword) {
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) return res.status(400).json({ error: "Current Password is incorrect" });

          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(newPassword, salt);
      }

      // Update profile image if provided
      if (profileImg) {
          if (user.profileImg) {
              // Delete old profile image from Cloudinary
              await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
          }
          // Upload new profile image to Cloudinary
          const uploadedResponse = await cloudinary.uploader.upload(profileImg);
          user.profileImg = uploadedResponse.secure_url;
      }

      // Update cover image if provided
      if (coverImg) {
          if (user.coverImg) {
              // Delete old cover image from Cloudinary
              await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
          }
          // Upload new cover image to Cloudinary
          const uploadedResponse = await cloudinary.uploader.upload(coverImg);
          user.coverImg = uploadedResponse.secure_url;
      }

      // Update other user details
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.username = username || user.username;
      user.bio = bio || user.bio;
      user.link = link || user.link;

      // Save the updated user
      user = await user.save();

      // Remove password from the response
      user.password = undefined;

      return res.status(200).json(user);

  } catch (error) {
      console.log("Error in updateUserProfile:", error.message);
      res.status(500).json({ error: error.message });
  }
};