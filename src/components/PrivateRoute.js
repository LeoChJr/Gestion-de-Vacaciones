import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element, roleRequired }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    // Si no hay usuario autenticado, redirigir al login
    return <Navigate to="/login" />;
  }

  // Si el rol requerido no coincide, redirigir a una página de acceso denegado o página inicial
  if (roleRequired && userRole !== roleRequired) {
    return <Navigate to="/access-denied" />; // Puedes crear una página de acceso denegado o redirigir a inicio
  }

  return element;
};

export default PrivateRoute;
