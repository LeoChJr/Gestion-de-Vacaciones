// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Asegúrate de que la ruta sea correcta
import Login from './components/Login';
import Register from './components/Register';
import VacationForm from './components/VacationForm';
import PrivateRoute from './components/PrivateRoute'; // Importa el componente de ruta privada

const App = () => {
    return (
        <AuthProvider> {/* Añade el AuthProvider aquí */}
            <Router>
                <div className="container">
                    <h1>Solicitud de Vacaciones</h1>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/vacation-form" element={<PrivateRoute element={<VacationForm />} />} /> {/* Ruta protegida */}
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
