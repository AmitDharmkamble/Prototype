import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file if you use it

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
    
        try {
            const response = await axios.post('https://localhost:44303/login', {
                username,
                password
            }, {
                timeout: 5000 // 5 seconds timeout
            });
            setToken(response.data.token);
            setError('');
            localStorage.setItem('jwtToken', response.data.token);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error(err);
        }
    };
    

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Login;
