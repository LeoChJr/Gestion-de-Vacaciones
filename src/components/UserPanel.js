import React, { useState } from "react";
import { db } from "../firebase"; // Configuración de Firebase
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "./UserPanel.css";

const UserPanel = () => {
  const navigate = useNavigate(); // Hook para la navegación

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
    age: "",
    seniority: "",
    days: "",
    startDate: "",
    password: "", // Nuevo campo para la contraseña
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      // Crear usuario en la autenticación de Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userId = userCredential.user.uid;

      // Guardar en la colección "vacaciones"
      await addDoc(collection(db, "vacaciones"), {
        ...formData,
        status: "pendiente", // Estado inicial
        uid: userId, // Relacionar con la autenticación
      });

      // Guardar en la colección "users" con el mismo UID
      await setDoc(doc(db, "users", userId), {
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
        age: formData.age,
        seniority: formData.seniority,
        startDate: formData.startDate,
      });

      alert("Solicitud, usuario y datos adicionales guardados correctamente.");
      setFormData({
        email: "",
        name: "",
        surname: "",
        age: "",
        seniority: "",
        days: "",
        startDate: "",
        password: "",
      }); // Resetear el formulario
    } catch (error) {
      console.error("Error al guardar la solicitud y los datos del usuario:", error);
      alert("Error al guardar la solicitud y los datos del usuario.");
    }
  };

  const handleBack = () => {
    navigate("/admin"); // Cambia "/" por la ruta a la que quieres que regrese
  };

  return (
    <div className="user-panel-container">
      <h2>Formulario de Solicitud de Vacaciones</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Apellido:</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Edad:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Antigüedad en la empresa (años):</label>
          <input
            type="number"
            name="seniority"
            value={formData.seniority}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Días solicitados:</label>
          <input
            type="number"
            name="days"
            value={formData.days}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Fecha de Inicio:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">
            Guardar
          </button>
          <button
            type="button"
            className="back-button"
            onClick={handleBack}
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserPanel;
