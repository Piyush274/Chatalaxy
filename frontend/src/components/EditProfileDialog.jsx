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
        <div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button >Edit Profile</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader className='items-center'>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Full Name"
                                value={formData.fullName}
                                name="fullName"
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                name="username"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                name="email"
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                placeholder="Bio"
                                value={formData.bio}
                                name="bio"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Current Password"
                                value={formData.currentPassword}
                                name="currentPassword"
                                onChange={handleInputChange}
                            />
                            <Input
                                type="password"
                                placeholder="New Password"
                                value={formData.newPassword}
                                name="newPassword"
                                onChange={handleInputChange}
                            />
                        </div>

                        <Input
                            type="text"
                            placeholder="Link"
                            value={formData.link}
                            name="link"
                            onChange={handleInputChange}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isUpdatingProfile}>
                                {isUpdatingProfile ? 'Updating...' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}