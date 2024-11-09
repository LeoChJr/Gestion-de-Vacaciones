import React, { useState } from "react";
import { auth, db } from "../firebase"; // Asegúrate de importar la instancia de Firestore
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import "./VacationForm.css";

const VacationForm = () => {
  const { userRole } = useAuth(); // Accede al userRole desde el contexto
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState("");
  const [seniority, setSeniority] = useState(""); // Tiempo de antigüedad
  const [days, setDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    const vacationDays = seniority * 3; // Por ejemplo, 3 días de vacaciones por año de antigüedad
setDays(vacationDays);

    event.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) {
      setMessage("La fecha de inicio debe ser hoy o en el futuro.");
      return;
    }

    try {
      // Obtener el usuario actual
      const user = auth.currentUser;
      if (!user) {
        setMessage("Debes iniciar sesión para solicitar vacaciones.");
        return;
      }

      // Guardar la solicitud en Firestore
      await addDoc(collection(db, "vacaciones"), {
        userId: user.uid, // Almacena el ID del usuario
        email: user.email, // Almacena el correo del usuario (opcional)
        name: name,
        surname: surname,
        age: Number(age),
        seniority: seniority, // Tiempo de antigüedad
        days: Number(days),
        startDate: startDate,
      });
      setMessage(`Solicitud enviada: ${days} día(s) desde ${startDate}.`);
      setDays("");
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
                <label htmlFor="days">Días de Vacaciones:</label>
                <select
                  id="days"
                  className="input-select"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  required
                >
                  <option value="">Selecciona días</option>
                  {Array.from({ length: 28 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} día(s)
                    </option>
                  ))}
                </select>
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
