// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; // Importa el módulo de autenticación si lo necesitas
import { getFirestore } from 'firebase/firestore'; // Importa Firestore

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD6aBiMfkyEMpdG2W_n7dhiIHDLBNcn7oM",
  authDomain: "proyecto-vacaciones-d04fb.firebaseapp.com",
  projectId: "proyecto-vacaciones-d04fb",
  storageBucket: "proyecto-vacaciones-d04fb.firebasestorage.app",
  messagingSenderId: "318002782774",
  appId: "1:318002782774:web:5dae2e2bc0381ca511ee97",
  measurementId: "G-1XL5GFK5F9"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa la autenticación
const db = getFirestore(app); // Inicializa Firestore

export { app, auth, db }; // Exporta app, auth y db para usarlos en otros componentes
//nose