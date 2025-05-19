import React, { useEffect } from 'react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdate } from './hooks/useUpdate';
import { FaUserEdit, FaLock, FaLink, FaEnvelope, FaSignature } from 'react-icons/fa';
import { HiOutlinePencil } from 'react-icons/hi';

export default function EditProfileDialog({ authUser }) {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        bio: "",
        link: "",
        newPassword: "",
        currentPassword: "",
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [dialogOpen, setDialogOpen] = useState(false);

    const { updateProfile, isUpdatingProfile } = useUpdate();

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
    };

    useEffect(() => {
        if (authUser) {
            setFormData({
                fullName: authUser.fullName || "",
                username: authUser.username || "",
                email: authUser.email || "",
                bio: authUser.bio || "",
                link: authUser.link || "",
                newPassword: "",
                currentPassword: "",
            });
        }
    }, [authUser]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-transparent border border-white/30 hover:bg-white/10 text-white hover:text-white">
                    <HiOutlinePencil className="mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-gray-900/90 backdrop-blur-lg border border-white/10 rounded-xl max-w-md">
                <DialogHeader className='items-center'>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <FaUserEdit className="text-blue-400" />
                        <span>Edit Profile</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-4">
                        <div className="relative">
                            <FaSignature className="absolute left-3 top-3 text-white/50" />
                            <Input
                                type="text"
                                placeholder="Full Name"
                                value={formData.fullName}
                                name="fullName"
                                onChange={handleInputChange}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <FaUserEdit className="absolute left-3 top-3 text-white/50" />
                            <Input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                name="username"
                                onChange={handleInputChange}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-white/50" />
                            <Input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                name="email"
                                onChange={handleInputChange}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <HiOutlinePencil className="absolute left-3 top-3 text-white/50" />
                            <Input
                                type="text"
                                placeholder="Bio"
                                value={formData.bio}
                                name="bio"
                                onChange={handleInputChange}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <FaLink className="absolute left-3 top-3 text-white/50" />
                            <Input
                                type="text"
                                placeholder="Link"
                                value={formData.link}
                                name="link"
                                onChange={handleInputChange}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-white/50" />
                            <Input
                                type="password"
                                placeholder="Current Password"
                                value={formData.currentPassword}
                                name="currentPassword"
                                onChange={handleInputChange}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-white/50" />
                            <Input
                                type="password"
                                placeholder="New Password"
                                value={formData.newPassword}
                                name="newPassword"
                                onChange={handleInputChange}
                                className="pl-10 bg-white/5 border-white/20 text-white placeholder-white/40 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button 
                            type="submit" 
                            disabled={isUpdatingProfile}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                            {isUpdatingProfile ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : 'Update Profile'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}