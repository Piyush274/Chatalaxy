import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });

    const navigate=useNavigate();

    const { mutate: signup, isError, isLoading } = useMutation({
        mutationFn: async ({ fullName, username, email, password }) => {
            try {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, username, email, password })
                });
                
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to create account');
                
                console.log('Signup Console', data);             
                return data;

            } catch (error) {
                console.log('Signup Console', error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success('Account created successfully ! Please login.');
            navigate('/login');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(form);
    };

    return (
        <div className="mx-auto min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md hover:transform hover:scale-105 duration-300">
                <h1 className="text-2xl font-bold mb-6 text-center">Join Hill<span className='text-blue-500'>Connect</span></h1>
                
                <input
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                
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
                    placeholder="Full Name"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
                    {isLoading ? 'Loading...' : 'Signup'}
                </button>
                
                {isError && (
                    <p className="text-red-500 text-center mt-4">{isError.message}</p>
                )}
                
                <h3 className="text-center mt-6">
                    Already Registered?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </h3>
            </form>
        </div>
    );
}