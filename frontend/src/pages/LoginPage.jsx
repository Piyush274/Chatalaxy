import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const queryClient = useQueryClient();

    const { mutate: login, isError, isLoading, error } = useMutation({
        mutationFn: async ({ username, password }) => {
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to login');

                console.log('Login Console', data);
                return data;
            } catch (error) {
                console.log('Login Console', error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success('Login Successful');
            queryClient.invalidateQueries(['authUser']); // Refetch the data
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(form);
    };

    return (
        <div className="mx-auto min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md hover:transform hover:scale-105 duration-300">
                <h1 className="text-2xl font-bold mb-6 text-center">Hill<span className='text-blue-500'>Connect</span></h1>
                
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
                
                {isError && (
                    <p className="text-red-500 text-center mt-4">{error.message}</p>
                )}
                
                <h3 className="text-center mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Signup
                    </Link>
                </h3>
            </form>
        </div>
    );
}