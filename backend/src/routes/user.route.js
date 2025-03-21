import express from "express";
import {getUserProfile,getSuggestUser,followUnfollowUser,updateUserProfile} from "../controllers/user.controller.js";
import {protectRoute} from "../middlewares/protectRoute.middleware.js"


const router=express.Router();

router.get('/profile/:username',protectRoute,getUserProfile);

router.get('/suggested',protectRoute,getSuggestUser);

router.post('/follow/:id',protectRoute,followUnfollowUser);

router.post('/update',protectRoute,updateUserProfile);

export default router;