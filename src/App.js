import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import VacationForm from './components/VacationForm';
import UserRequests from './components/UserRequests';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import UserPanel from './components/UserPanel'; // Importa UserPanel
import AdminSolicitudes from './components/AdminSolicitudes';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <h1>Solicitud de Vacaciones</h1>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vacation-form" element={<PrivateRoute element={<VacationForm />} />} />
            <Route path="/user-requests" element={<PrivateRoute element={<UserRequests />} />} />
            <Route path="/admin" element={<PrivateRoute element={<AdminPanel />} roleRequired="admin" />} />
            <Route path="/user-panel" element={<PrivateRoute element={<UserPanel />} />} /> {/* Ruta para el Panel de Usuario */}
            <Route path="/AdminSolis" element={<AdminSolicitudes />} />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
