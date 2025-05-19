import express from "express";
import { createPost,deletePost,likeUnlikePost,commentOnPost,getAllPosts,getLikedPosts,getFollowingPosts,getUserPosts} from "../controllers/post.controller.js";
import {protectRoute} from "../middlewares/protectRoute.middleware.js"

const router=express.Router();

router.get('/all',protectRoute,getAllPosts);

router.get('/likedPost/:id',protectRoute,getLikedPosts);

router.get('/followingPosts',protectRoute,getFollowingPosts);

router.get('/userPosts/:username',protectRoute,getUserPosts);

router.post('/create',protectRoute,createPost);

router.delete('/delete/:id',protectRoute,deletePost);

router.post('/like/:id',protectRoute,likeUnlikePost);

router.post('/comment/:id',protectRoute,commentOnPost);

export default router;