import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {  useQuery } from "@tanstack/react-query";

import Posts from './../components/Posts';
import EditProfileDialog from "./../components/EditProfileDialog";

import { FaArrowLeft} from "react-icons/fa6";
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


    const { data: user, isLoading, refetch, isRefetching } = useQuery({
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

    const { follow} = useFollow();
    const {updateProfile, isUpdatingProfile}=useUpdate();

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
    }, [username]);

    return (
        <>
            <div className='w-2/3 p-4 min-h-screen'>
                {(isLoading || isRefetching) && <Skeleton />}

                {!isLoading && !user && !isRefetching && <p className="text-center text-red-500">User not found</p>}

                {!isLoading && !isRefetching && user && (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            <Link to="/" className="text-gray-600 hover:text-blue-500">
                                <FaArrowLeft className="text-xl" />
                            </Link>
                            <div>
                                <p className="font-semibold text-lg">{user?.fullName}</p>
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src={coverImg || user?.coverImg}
                                alt="cover image"
                                onError={(e) => { e.target.onerror = null; e.target.src = "/coverDefault.jpg"; }}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            {isMyProfile && (
                                <div
                                    className="absolute top-2 right-2 bg-white p-2 rounded-full cursor-pointer hover:bg-gray-100"
                                    onClick={() => coverImgRef.current.click()}
                                >
                                    <MdEdit className="text-xl text-gray-700" />
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

                            <div className="absolute -bottom-10 left-4">
                                <div className="relative">
                                    <img
                                        src={profileImg || user?.profileImg}
                                        alt="profile image"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
                                        className="w-20 h-20 rounded-full border-4 border-white object-cover"
                                    />
                                    {isMyProfile && (
                                        <div
                                            className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer hover:bg-gray-100"
                                            onClick={() => profileImgRef.current.click()}
                                        >
                                            <MdEdit className="text-lg text-gray-700" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            {isMyProfile && <EditProfileDialog authUser={authUser} />}

                            {!isMyProfile && (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200"
                                    onClick={() => follow(user?._id)}
                                >
                                    {amIFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}

                            {(coverImg || profileImg) && (
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-200"
                                    onClick={() => updateProfile({coverImg, profileImg})}
                                >
                                    {isUpdatingProfile ? 'Updating' : 'Update'}
                                </button>
                            )}
                        </div>

                        <div className='flex flex-col gap-4 mt-4 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href={user?.link}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													{user?.link}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>{memberSinceDate}</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>

                        <div className="flex gap-4 border-b border-gray-300 mt-6">
                            <div
                                className={`cursor-pointer p-3 ${
                                    feedType === "posts" ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"
                                }`}
                                onClick={() => setFeedType("posts")}
                            >
                                Posts
                            </div>
                            <div
                                className={`cursor-pointer p-3 ${
                                    feedType === "likes" ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"
                                }`}
                                onClick={() => setFeedType("likes")}
                            >
                                Likes
                            </div>
                        </div>

                        <Posts feedType={feedType} username={username} id={user?._id} />
                    </>
                )}
            </div>
        </>
    );
};

export default ProfilePage;