import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Posts from './../components/Posts';
import EditProfileDialog from "./../components/EditProfileDialog";

import { FaArrowLeft } from "react-icons/fa6";
import { FaLink } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton"
import { useFollow } from "./../components/hooks/useFollow";
import { useUpdate } from "./../components/hooks/useUpdate";
import { formatMemberSinceDate } from "../utils/date/index.js";

const ProfilePage = () => {
    const [coverImg, setCoverImg] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [feedType, setFeedType] = useState("posts");

    const coverImgRef = useRef(null);
    const profileImgRef = useRef(null);

    const { username } = useParams();

    const { data: authUser } = useQuery({ queryKey: ['authUser'] });

    const { data: user, isLoading, isPending, refetch, isRefetching } = useQuery({
        queryKey: ['userProfile', username],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/user/profile/${username}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Something went wrong');
                return data;
            } catch (error) {
                throw new Error(error);
            }
        }
    });

    const isMyProfile = authUser?._id === user?._id;
    const { follow } = useFollow();
    const { updateProfile, isUpdatingProfile } = useUpdate();
    const amIFollowing = authUser?.following.includes(user?._id);
    const memberSinceDate = formatMemberSinceDate(user?.createdAt);

    const handleImgChange = (e, state) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                state === "coverImg" && setCoverImg(reader.result);
                state === "profileImg" && setProfileImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        refetch();
    }, [username, refetch]);

    return (
        <div className='w-full lg:w-2/3 p-4 min-h-screen'>
            {/* Loading State */}
            {(isPending || isLoading || isRefetching) && (
                <div className='space-y-3'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-3 w-3/4 rounded bg-white/10" />
                                    <Skeleton className="h-2 w-1/2 rounded bg-white/10" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && !user && !isRefetching && (
                <p className="text-center text-red-500 p-4 bg-white/5 rounded-xl border border-white/10">
                    User not found
                </p>
            )}

            {!isLoading && !isRefetching && user && (
                <>
                    <div className="flex items-center gap-4 mb-6">
                        <Link 
                            to="/" 
                            className="text-white hover:text-blue-500 transition-colors"
                        >
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <div>
                            <p className="font-semibold text-white text-lg">{user?.fullName}</p>
                        </div>
                    </div>

                    {/* Cover Image Section */}
                    <div className="relative">
                        <img
                            src={coverImg || user?.coverImg}
                            alt="cover image"
                            onError={(e) => { e.target.onerror = null; e.target.src = "/coverDefault.jpg"; }}
                            className="w-full h-40 md:h-48 object-cover rounded-lg"
                        />
                        {isMyProfile && (
                            <div
                                className="absolute top-2 right-2 bg-white/90 p-2 rounded-full cursor-pointer hover:bg-white transition-colors"
                                onClick={() => coverImgRef.current.click()}
                            >
                                <MdEdit className="text-lg text-gray-800" />
                            </div>
                        )}

                        <input
                            type="file"
                            hidden
                            ref={coverImgRef}
                            onChange={(e) => handleImgChange(e, "coverImg")}
                        />
                        <input
                            type="file"
                            hidden
                            ref={profileImgRef}
                            onChange={(e) => handleImgChange(e, "profileImg")}
                        />

                        {/* Profile Image Section */}
                        <div className="absolute -bottom-12 left-4">
                            <div className="relative">
                                <img
                                    src={profileImg || user?.profileImg}
                                    alt="profile image"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/80 object-cover"
                                />
                                {isMyProfile && (
                                    <div
                                        className="absolute bottom-0 right-0 bg-white/90 p-1 rounded-full cursor-pointer hover:bg-white transition-colors"
                                        onClick={() => profileImgRef.current.click()}
                                    >
                                        <MdEdit className="text-base md:text-lg text-gray-800" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-14 md:mt-16">
                        {isMyProfile && <EditProfileDialog authUser={authUser} />}

                        {!isMyProfile && (
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200 text-sm md:text-base"
                                onClick={() => follow(user?._id)}
                            >
                                {amIFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        )}

                        {(coverImg || profileImg) && (
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-200 text-sm md:text-base"
                                onClick={() => updateProfile({ coverImg, profileImg })}
                                disabled={isUpdatingProfile}
                            >
                                {isUpdatingProfile ? 'Updating...' : 'Update'}
                            </button>
                        )}
                    </div>

                    {/* Profile Info Section */}
                    <div className='flex flex-col gap-4 mt-4 px-2 md:px-4'>
                        <div className='flex flex-col'>
                            <span className='font-bold text-lg text-white'>{user?.fullName}</span>
                            <span className='text-sm text-white/80'>@{user?.username}</span>
                            <span className='text-sm my-1 text-white/80'>{user?.bio}</span>
                        </div>

                        <div className='flex gap-4 flex-wrap'>
                            {user?.link && (
                                <div className='flex gap-2 items-center'>
                                    <FaLink className='text-white/80 text-sm' />
                                    <a
                                        href={user?.link}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='text-sm text-blue-400 hover:underline break-all'
                                    >
                                        {user?.link.length > 30 ? `${user?.link.substring(0, 30)}...` : user?.link}
                                    </a>
                                </div>
                            )}
                            <div className='flex gap-2 items-center'>
                                <IoCalendarOutline className='text-white/80 text-sm' />
                                <span className='text-sm text-white/80'>{memberSinceDate}</span>
                            </div>
                        </div>

                        <div className='flex gap-4 text-white/80'>
                            <div className='flex gap-1 items-center'>
                                <span className='font-bold text-sm'>{user?.following.length}</span>
                                <span className='text-sm'>Following</span>
                            </div>
                            <div className='flex gap-1 items-center'>
                                <span className='font-bold text-sm'>{user?.followers.length}</span>
                                <span className='text-sm'>Followers</span>
                            </div>
                        </div>
                    </div>

                    {/* Feed Type Tabs */}
                    <div className="flex gap-4 border-b border-white/10 mt-6">
                        <button
                            className={`px-2 py-3 text-sm md:text-base md:px-4 transition-colors ${
                                feedType === "posts" 
                                    ? "border-b-2 border-blue-400 font-semibold text-white" 
                                    : "text-white/60 hover:text-white"
                            }`}
                            onClick={() => setFeedType("posts")}
                        >
                            Posts
                        </button>
                        <button
                            className={`px-2 py-3 text-sm md:text-base md:px-4 transition-colors ${
                                feedType === "likes" 
                                    ? "border-b-2 border-blue-400 font-semibold text-white" 
                                    : "text-white/60 hover:text-white"
                            }`}
                            onClick={() => setFeedType("likes")}
                        >
                            Likes
                        </button>
                    </div>

                    <Posts feedType={feedType} username={username} id={user?._id} />
                </>
            )}
        </div>
    );
};

export default ProfilePage;