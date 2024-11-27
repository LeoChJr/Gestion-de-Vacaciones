import React, { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./VacationForm.css";
import { Link } from "react-router-dom";

const VacationForm = () => {
  const { userRole } = useAuth();
  const [requestedDays, setRequestedDays] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) {
      setMessage("La fecha de inicio debe ser hoy o en el futuro.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + requestedDays);
    const endDate = end.toISOString().split("T")[0];

    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage("Debes iniciar sesión para solicitar vacaciones.");
        return;
      }

      const vacationRequest = {
        userId: user.uid,
        email: user.email,
        days: requestedDays,
        startDate,
        endDate,
        status: "pendiente", // Estado predeterminado
      };

      await addDoc(collection(db, "vacaciones"), vacationRequest);
      setMessage(
        `Solicitud enviada: ${requestedDays} día(s) desde ${startDate} hasta ${endDate}.`
      );
      setRequestedDays(0);
      setStartDate("");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setMessage("Error al enviar la solicitud. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="vacation-request-container">
      <nav className="navbar">
        <a className="navbar-brand" href="#">
          KIRO
        </a>
        <div className="navbar-menu">
          <Link className="nav-link" to="/user-requests">
            Solicitudes
          </Link>
          <Link className="nav-link" to="/login">
            Cerrar Sesión
          </Link>
        </div>
      </nav>
      <div className="content-container">
        <h1>Solicita tus Vacaciones</h1>
        <p>
          Ingresa los días de vacaciones que deseas solicitar y selecciona la
          fecha de inicio.
        </p>
        <div className="form-wrapper">
          <div className="form-card">
            <h2>Formulario de Vacaciones</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-section">
                <label htmlFor="requestedDays">
                  Días de Vacaciones Solicitados:
                </label>
                <input
                  type="number"
                  id="requestedDays"
                  className="input-field"
                  value={requestedDays}
                  onChange={(e) => setRequestedDays(Number(e.target.value))}
                  required
                />
              </div>
              <div className="input-section">
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
            {message && <div className="notification-message">{message}</div>}
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>© 2024 KIRO. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default VacationForm;
