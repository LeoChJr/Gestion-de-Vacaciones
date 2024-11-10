import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // Guardar rol del usuario
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Obtener el rol del usuario desde Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role); // Almacena el rol del usuario
          } else {
            setUserRole(null); // Si el usuario no tiene rol, asignar null
          }
        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error);
          setUserRole(null); // Asignar null si hay un error
        }
      } else {
        setUserRole(null); // Si el usuario no está autenticado, establecer rol en null
      }
      setLoading(false); // Establecer el estado de loading en false después de procesar
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole, // Exponer el rol del usuario
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Solo renderizar los niños cuando no se esté cargando */}
    </AuthContext.Provider>
  );
};
