import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaHeart, FaRegHeart, FaRegBookmark, FaRegComment, FaComment } from 'react-icons/fa';
import { BiRepost } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formatPostDate } from '../utils/date/index.js';
import AddComments from './AddComments';

export default function PostCard({ post, openCommentId, setOpenCommentId }) {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const postOwner = post.user;
  const isMyPost = authUser?._id === postOwner._id;
  const isLiked = post.likes.includes(authUser?._id);
  const formattedDate = formatPostDate(post.createdAt);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const isCommentOpen = openCommentId === post._id;

  // Delete Post Mutation
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/delete/${post._id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete post');
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success('Post deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
  
  // Like Post Mutation
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/like/${post._id}`, { method: 'POST' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to like post');
        return data.likes;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Comment Post Mutation
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/comment/${post._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to comment post');
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (newComment) => {
      toast.success('Comment added successfully');
      setComment('');
      setComments((prevComments) => [...prevComments, newComment]);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleDeletePost = () => {
    if (isDeleting) return;
    deletePost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    commentPost();
  };

  const toggleCommentDialog = () => {
    if (isCommentOpen) {
      setOpenCommentId(null);
    } else {
      setOpenCommentId(post._id);
    }
  };

  return (
    <div className={`p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors duration-300 ${
      isCommentOpen ? 'relative z-[50]' : ''
    }`}>
      <div className='flex items-start gap-4'>
        <Link to={`/profile/${postOwner?.username}`}>
          <img
            className='w-12 h-12 rounded-full object-cover border-2 border-white/20 hover:border-blue-400 transition-colors'
            src={postOwner?.profileImg}
            onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
            alt='avatar'
          />
        </Link>

        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <Link to={`/profile/${postOwner?.username}`}>
              <h2 className='font-semibold text-white hover:text-blue-300 transition-colors'>
                {postOwner?.fullName}
              </h2>
            </Link>
            <Link to={`/profile/${postOwner?.username}`}>
              <span className='text-sm text-white/60 hover:text-white/80 transition-colors'>
                @{postOwner?.username}
              </span>
            </Link>
            <span className='text-sm text-white/40'>{formattedDate}</span>
            {isMyPost && (
              <button
                onClick={handleDeletePost}
                disabled={isDeleting}
                className='ml-auto text-white/50 hover:text-red-400 transition-colors'
              >
                <FaTrash />
              </button>
            )}
          </div>

          <div className='mt-2'>
            <p className='text-white/90'>{post?.text}</p>
          </div>

          {post.img && (
            <div className='mt-4 rounded-lg overflow-hidden border border-white/10'>
              <img
                className='w-full h-auto max-h-96 object-cover'
                src={post?.img}
                alt='Post Image'
              />
            </div>
          )}

          <div className='flex items-center justify-between mt-4 text-white/60'>
            <button
              onClick={handleLikePost}
              disabled={isLiking}
              className='flex items-center gap-1 hover:text-red-400 transition-colors group'
            >
              {isLiked ? (
                <FaHeart className='text-red-500' />
              ) : (
                <FaRegHeart className='group-hover:scale-110 transition-transform' />
              )}
              <span className='text-sm'>{post.likes.length}</span>
            </button>

            <button
              onClick={toggleCommentDialog}
              className='flex items-center gap-1 hover:text-blue-400 transition-colors group'
            >
              {isCommentOpen ? (
                <FaComment className='text-blue-400' />
              ) : (
                <FaRegComment className='group-hover:scale-110 transition-transform' />
              )}
              <span className='text-sm'>{post.comments.length}</span>
            </button>

            <button className='flex items-center gap-1 hover:text-green-400 transition-colors group'>
              <BiRepost className='group-hover:scale-110 transition-transform' />
              <span className='text-sm'>0</span>
            </button>

            <button className='hover:text-yellow-400 transition-colors group'>
              <FaRegBookmark className='group-hover:scale-110 transition-transform' />
            </button>
          </div>
        </div>
      </div>

      {/* Comment Dialog - Using the new AddComments component */}
      <AddComments
        post={post}
        comments={comments}
        setComments={setComments}
        isOpen={isCommentOpen}
        onClose={() => setOpenCommentId(null)}
        onSubmit={handlePostComment}
        comment={comment}
        setComment={setComment}
        isCommenting={isCommenting}
      />
    </div>
  );
}