// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = { Username: username, Password: password };

        try {
            const response = await axios.post('https://localhost:44303/Login/Login', data, {
                headers: { 'Content-Type': 'application/json' },
            });

            const token = response.data.token;
            if (token) {
                localStorage.setItem('authToken', token);
                window.location.href = '/dashboard';
            } else {
                setError('Invalid login response. Token not found.');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        <div className="container bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 class="text-3xl font-bold text-center text-gray-700 mb-6">Please Login</h2>
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                    <label className="block mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        required
                    />
                </div>
                <div className="relative">
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        required
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div class="flex items-center justify-between">
                <label class="flex items-center text-gray-600">
                    <input type="checkbox" name="rememberMe"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                    <span class="ml-2">Remember me</span>
                </label>
                <a href="#" class="text-sm text-blue-500 hover:underline">Forgot password?</a>
            </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
