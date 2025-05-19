import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useState, useRef } from 'react';
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

export default function CreatePost() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending: isLoading, isError, error } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch('/api/post/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, img })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create post');
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setText('');
      setImg(null);
      toast.success('Post created successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImg = () => {
    setImg(null);
    imgRef.current.value = null;
  };

  return (
    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={authUser.profileImg}
          alt="avatar"
          onError={(e) => { e.target.onerror = null; e.target.src = "/profileDefault.jpg"; }}
          className="w-12 h-12 rounded-full object-cover border-2 border-white/20 hover:border-blue-400 transition-colors"
        />
        <span className="font-semibold text-white/90">@{authUser.username}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-white/40"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => imgRef.current.click()}
              className="p-2 text-white/70 hover:text-blue-400 hover:bg-white/10 rounded-full transition-colors"
            >
              <CiImageOn className="w-6 h-6" />
            </button>

            <input
              hidden
              ref={imgRef}
              type="file"
              onChange={handleImgChange}
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !img)}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Posting...
              </>
            ) : "Post"}
          </button>
        </div>

        {img && (
          <div className="relative mt-4 w-full max-h-96 rounded-xl overflow-hidden border border-white/10">
            <button
              onClick={handleRemoveImg}
              className="absolute top-3 right-3 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <IoCloseSharp className="w-5 h-5" />
            </button>
            <img
              src={img}
              alt="uploaded-img"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {isError && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-center">
            {error.message}
          </div>
        )}
      </form>
    </div>
  );
}