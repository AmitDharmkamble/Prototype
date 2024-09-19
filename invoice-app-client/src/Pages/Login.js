import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        // Create the data object matching LoginModel
        const data = {
            Username: username,  // Matching the LoginModel Username property
            Password: password,  // Matching the LoginModel Password property
        };

        try {
            const response = await axios.post('https://localhost:44303/Login/Login', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Login successful:', response.data);
            setError('');
            alert('Login Successfully');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message); // Show server error message
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        <div>
            {/* <form onSubmit={handleLogin} class="space-y-6">
                <div class="relative">
                    <input
                        type="text"
                        id="username"
                        value={username}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit"
                    class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:bg-gradient-to-l hover:from-purple-600 hover:to-blue-500 transition duration-200 transform hover:scale-105 shadow-lg">Login</button>
            </form>
            {error && <p className="error">{error}</p>} */}
            <form onSubmit={handleLogin}>
                <div className="h-screen flex items-center justify-center bg-gray-100">

                    <div className="bg-white py-5 px-8 border-t-4 border-blue-700 rounded-md shadow-lg">

                        <h2 className="text-3xl text-gray-400 mb-3">Login</h2>
                        {error && <p className="error text-red">{error}</p>}

                        <div className="mb-2">
                            <label className="text-sm">Name</label>
                            <input type="text" placeholder="Name" className="w-full p-2 mt-1 bg-gray-200 rounded-md focus:outline-none" onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className="mt-2 mb-3">
                            <label className="text-sm">Password</label>
                            <input type="password" placeholder="Password" className="w-full p-2 mt-1 bg-gray-200 rounded-md focus:outline-none" onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <button
                            className="border-none bg-blue-800 py-2 px-3 text-white roudend-sm w-full mt-2 rounded-md hover:bg-blue-700 mb-5"
                            type="submit"
                        >
                            Sign In
                        </button>

                        <a href="#" className="text-sm text-blue-400">Forgot my Password</a>

                    </div>

                </div>
            </form>
        </div>

    );
};

export default LoginForm;
