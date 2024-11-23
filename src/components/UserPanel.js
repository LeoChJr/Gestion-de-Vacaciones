import React, { useState } from "react";
import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore"; // Para guardar los datos en Firestore
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Para la navegación
import "./UserPanel.css";  // Asegúrate de importar solo en este componente

const UserPanel = () => {
  const { currentUser } = useAuth(); // Obtenemos el usuario actual
  const navigate = useNavigate(); // Instanciamos useNavigate para redirigir

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState("");
  const [seniority, setSeniority] = useState("");
  const [requestedDays, setRequestedDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let additionalDays = 0;
  
    // Calculamos los días adicionales dependiendo de la antigüedad
    if (seniority > 15) {
      additionalDays = 20;
    } else if (seniority >= 10) {
      additionalDays = 10;
    } else if (seniority >= 5) {
      additionalDays = 5;
    }
  
    const vacationDays = requestedDays + additionalDays; // Total de días de vacaciones
    setTotalDays(vacationDays);
  
    // Verificación de la fecha de inicio
    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) {
      setMessage("La fecha de inicio debe ser hoy o en el futuro.");
      return;
    }
  
    // Calculando la fecha de finalización
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + vacationDays);
    const endDate = end.toISOString().split("T")[0];
  
    try {
      if (!currentUser) {
        setMessage("Debes iniciar sesión para completar el formulario.");
        return;
      }
  
      // Creamos una referencia al documento de usuario usando su email
      const userRef = doc(db, "users", currentUser.email); // Usamos el correo como ID de documento
      const userData = {
        name,
        surname,
        age: Number(age),
        seniority: Number(seniority),
        requestedDays,
        totalDays: vacationDays,
        startDate,
        endDate,
      };
  
      // Guardamos los datos en Firestore
      await setDoc(userRef, userData);
      setMessage("Datos guardados correctamente");
      setTotalDays(0);
      setRequestedDays(0);
      setStartDate("");
      setName("");
      setSurname("");
      setAge("");
      setSeniority("");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setMessage("Error al guardar los datos. Inténtalo de nuevo.");
    }
  };
  

  const volver = () => {
    navigate("/admin"); // Redirige a la página de administración
  };

  return (
    <div className="user-panel-container">
      <h2>Formulario de Datos del Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="surname">Apellido:</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="age">Edad:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="seniority">Antigüedad en la Empresa (años):</label>
          <input
            type="number"
            id="seniority"
            name="seniority"
            value={seniority}
            onChange={(e) => setSeniority(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="requestedDays">Días de Vacaciones Solicitados:</label>
          <input
            type="number"
            id="requestedDays"
            name="requestedDays"
            value={requestedDays}
            onChange={(e) => setRequestedDays(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="startDate">Fecha de Inicio:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Guardar Datos</button>
        <button type="button" onClick={volver}>Volver</button>
      </form>
      {message && <div className="notification-message">{message}</div>}
    </div>
  );
};

export default UserPanel;
