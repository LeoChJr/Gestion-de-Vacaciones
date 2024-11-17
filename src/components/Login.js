import React, { useState } from "react";
import { auth, db } from "../firebase"; // Asegúrate de importar la instancia de Firestore
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "./Login.css"; // Asegúrate de importar el archivo CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Obtener el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          navigate("/admin"); // Redirigir a adminPanel si es admin
        } else {
          navigate("/vacation-form"); // Redirigir a vacation-form si es usuario
        }
      } else {
        console.log("No se encontró el documento del usuario.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-area">
      <div className="login-card">
        <h2 className="login-title">LOGIN</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <div className="error-notification">{errorMessage}</div>
          )}

          <button type="submit" className="submit-button">
            LOGIN
          </button>
        </form>
        <p className="registration-link">
          No tienes una cuenta? <a href="/register"> Registrate</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
