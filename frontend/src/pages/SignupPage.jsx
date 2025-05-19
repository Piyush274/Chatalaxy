import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const { mutate: signup, isError, isLoading, error } = useMutation({
        mutationFn: async ({ fullName, username, email, password }) => {
            try {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, username, email, password })
                });
                
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to create account');
                return data;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            toast.success('Account created successfully! Please login.');
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
        <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* Glassmorphism form with space theme */}
            <form 
                onSubmit={handleSubmit} 
                className="relative bg-white/10 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20"
                style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
            >
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-xl pointer-events-none" 
                     style={{
                         boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.3)'
                     }}></div>
                
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-8 text-center text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Chatalaxy
                        </span>
                    </h1>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                            <input
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                placeholder="your@email.com"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                            <input
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                placeholder="username"
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                            <input
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                placeholder="Your Name"
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                            <input
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center mt-6"
                            style={{
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </>
                            ) : 'Sign Up'}
                        </button>
                    </div>
                    
                    {isError && (
                        <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-center">
                            {error.message}
                        </div>
                    )}
                    
                    <div className="mt-6 text-center text-white/70">
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className="text-blue-300 hover:text-blue-200 font-medium hover:underline transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </div>
                
                {/* Floating particles decoration */}
                <div className="absolute -z-10 inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={i}
                            className="absolute rounded-full bg-white/10"
                            style={{
                                width: `${Math.random() * 6 + 2}px`,
                                height: `${Math.random() * 6 + 2}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        ></div>
                    ))}
                </div>
            </form>
            
            {/* CSS for floating animation */}
            <style jsx>{`
                @keyframes float {
                    0% {
                        transform: translateY(0) translateX(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(20px);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}