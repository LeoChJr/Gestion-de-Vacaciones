import React, { useState } from "react";
import { auth, db } from "../firebase"; 
import { collection, addDoc } from "firebase/firestore"; 
import { useAuth } from '../context/AuthContext'; 
import UserRequests from './UserRequests'; // Importa el nuevo componente
import "./VacationForm.css";

const VacationForm = () => {
  const { userRole } = useAuth(); 
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

    if (seniority > 15) {
      additionalDays = 20; 
    } else if (seniority >= 10) {
      additionalDays = 10; 
    } else if (seniority >= 5) {
      additionalDays = 5; 
    }

    const vacationDays = requestedDays + additionalDays; 
    setTotalDays(vacationDays); 

    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) {
      setMessage("La fecha de inicio debe ser hoy o en el futuro.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + vacationDays); 
    const endDate = end.toISOString().split("T")[0]; 

    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage("Debes iniciar sesión para solicitar vacaciones.");
        return;
      }

      await addDoc(collection(db, "vacaciones"), {
        userId: user.uid, 
        email: user.email, 
        name: name,
        surname: surname,
        age: Number(age),
        seniority: Number(seniority), 
        days: vacationDays, 
        startDate: startDate,
        endDate: endDate, 
        status: "pendiente" // Agregar estado inicial
      });

      setMessage(`Solicitud enviada: ${vacationDays} día(s) desde ${startDate} hasta ${endDate}.`);
      setTotalDays(0);
      setRequestedDays(0);
      setStartDate("");
      setName("");
      setSurname("");
      setAge("");
      setSeniority("");
    } catch (error) {
      setMessage("Error al enviar la solicitud. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="vacation-form-container">
      <nav className="navbar">
        <a className="navbar-brand" href="#">
          Mi Empresa
        </a>
        <div className="navbar-menu">
          <a className="nav-link" href="#">
            Inicio
          </a>
          <a className="nav-link" href="#">
            Perfil
          </a>
          <a className="nav-link" href="#">
            Solicitudes
          </a>
          <a className="nav-link" href="#">
            Cerrar Sesión
          </a>
        </div>
      </nav>
      <div className="container">
        <h1>Bienvenido al Sistema de Solicitudes de Vacaciones</h1>
        {userRole === 'admin' && <p>Bienvenido, Admin. Puedes gestionar las solicitudes aquí.</p>}
        {userRole === 'user' && <p>Bienvenido, Usuario. Puedes enviar tu solicitud de vacaciones.</p>}
        <p>
          Aquí puedes solicitar tus días de vacaciones y ver el estado de tus
          solicitudes.
        </p>
        <UserRequests /> {/* Mostrar solicitudes del usuario */}
        <div className="form-container">
          <div className="card">
            <h2>Formulario de Vacaciones</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Nombre:</label>
                <input
                  type="text"
                  id="name"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="surname">Apellido:</label>
                <input
                  type="text"
                  id="surname"
                  className="input-field"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="age">Edad:</label>
                <input
                  type="number"
                  id="age"
                  className="input-field"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="seniority">Antigüedad en la Empresa (años):</label>
                <input
                  type="number"
                  id="seniority"
                  className="input-field"
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="requestedDays">Días de Vacaciones Solicitados:</label>
                <input
                  type="number"
                  id="requestedDays"
                  className="input-field"
                  value={requestedDays}
                  onChange={(e) => setRequestedDays(Number(e.target.value))}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="startDate">Fecha de Inicio:</label>
                <input
                  type="date"
                  id="startDate"
                  className="input-field"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Enviar Solicitud
              </button>
            </form>
            {message && <div className="success-message">{message}</div>}
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>© 2023 Mi Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default VacationForm;
