// src/App.js
import React, { useEffect, useState } from 'react';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Navbar from './Components/NavbarComponent'; // Adjust the path as necessary

const App = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const handlePathChange = () => setCurrentPath(window.location.pathname);
        window.addEventListener('popstate', handlePathChange); // Handle back/forward navigation

        return () => {
            window.removeEventListener('popstate', handlePathChange);
        };
    }, []);

    const navigate = (path) => {
        window.history.pushState({}, '', path);
        setCurrentPath(path);
    };

    const renderComponent = () => {
        switch (currentPath) {
            case '/dashboard':
                return <Dashboard />;
            case '/login':
            default:
                return <Login />;
        }
    };

    return (
        <div>
            {/* Render Navbar only if the current path is not '/login' and not '/' */}
            {currentPath !== '/login' && currentPath !== '/' && <Navbar navigate={navigate} />}
            {renderComponent()}
        </div>

    );
};

export default App;
