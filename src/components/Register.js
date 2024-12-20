import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Asegúrate de importar tu configuración de Firestore
import "./Register.css"; // Asegúrate de importar el archivo CSS

const Register = () => {
  const [name, setName] = useState(""); // Nuevo estado para el nombre
  const [surname, setSurname] = useState(""); // Nuevo estado para el apellido
  const [age, setAge] = useState(""); // Nuevo estado para la edad
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Crear el usuario
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Crear un documento para el usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        name, // Guardar el nombre
        surname, // Guardar el apellido
        age: Number(age), // Guardar la edad como número
        email: user.email,
        role: "user", // Asignar rol por defecto
      });

      console.log("Usuario registrado y documento creado en Firestore");
      // Aquí puedes redirigir a otra página o manejar el registro exitoso
      // Por ejemplo: window.location.href = '/login';
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="registration-area">
      <div className="registration-card">
        <h2 className="registration-title">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="text"
              className="input-field"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              className="input-field"
              placeholder="Apellido"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <input
              type="number"
              className="input-field"
              placeholder="Edad"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
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
            REGISTRARSE
          </button>
        </form>
        <p className="login-link">
          Ya tienes una cuenta? <a href="/login">Iniciar Sesion</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
