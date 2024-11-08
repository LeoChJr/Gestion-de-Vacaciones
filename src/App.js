import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './components/Login'; // Asegúrate de que la ruta sea correcta
import Register from './components/Register'; // Asegúrate de que la ruta sea correcta
import VacationForm from './components/VacationForm'; // Importa VacationForm

const App = () => {
    return (
        <Router>
            <div className="container">
                <h1>Solicitud de Vacaciones</h1>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/vacation-form" element={<VacationForm />} /> {/* Ruta para VacationForm */}
                    <Route path="/" element={<Navigate to="/login" />} /> {/* Redirige a /login */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;