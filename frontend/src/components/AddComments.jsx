import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPostDate } from '../utils/date/index.js';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AddComments({ 
  post, 
  comments, 
  isOpen,
  onClose,
  onSubmit,
  comment,
  setComment,
  isCommenting
}) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000]'>
      <div 
        className='bg-black backdrop-blur-md p-6 rounded-xl border border-white/10 w-full max-w-md'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl font-semibold text-white mb-4'>Comments</h2>
        
        <div className='max-h-96 overflow-y-auto pr-2'>
          {comments.map((comment) => (
            <div key={comment._id} className='flex items-start gap-3 mb-4 p-3 rounded-lg bg-white/5'>
              <img
                className='w-10 h-10 rounded-full object-cover border border-white/10'
                src={comment?.user.profileImg}
                alt='avatar'
                onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
              />
              <div>
                <div className='flex items-center gap-2'>
                  <Link to={`/profile/${comment.user.username}`}>
                    <h3 className='font-medium text-white hover:text-blue-300 transition-colors'>
                      {comment?.user.fullName}
                    </h3>
                  </Link>
                  <span className='text-xs text-white/40'>
                    {formatPostDate(comment.createdAt)}
                  </span>
                  {comment.user._id === post.user._id && (
                    <button
                      className='ml-auto text-white/50 hover:text-red-400 transition-colors'
                      onClick={() => {
                        // Add delete comment functionality here
                      }}
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
                <p className='text-white/80 mt-1'>{comment?.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className='mt-4'>
          <Input
            type='text'
            placeholder='Write a comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='bg-white/5 border-white/10 text-white placeholder-white/40'
            autoFocus
          />
          <div className='flex justify-end gap-2 mt-3'>
            <Button 
              type='button'
              onClick={onClose}
              variant='outline'
              className='border-white/20 hover:bg-white/10 hover:text-white'
            >
              Cancel
            </Button>
            <Button 
              type='submit'
              disabled={isCommenting || !comment.trim()}
              className='bg-blue-600 hover:bg-blue-700'
            >
              {isCommenting ? 'Posting...' : 'Comment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}