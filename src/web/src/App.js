import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CalendarPage from './components/CalendarPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('token', token); // Guarda el token
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token
        setIsAuthenticated(false);
    };
    
    return (
        <Router>
            <Routes>
                {/* Pagina de error 404*/}
                <Route
                    path="*"
                    element={<h1 style={{ textAlign: 'center' }}>404 - Página no encontrada</h1>}
                />

                {/* Ruta de inicio de sesión */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
                />
                {/* Ruta para registrar */}
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
                />

                {/* Ruta de la página principal */}
                <Route
                    path="/"
                    element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                {/* Ruta del calendario */}
                <Route
                    path="/calendar"
                    element={isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
}

export default App;
