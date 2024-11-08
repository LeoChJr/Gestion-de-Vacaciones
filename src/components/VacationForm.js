import React, { useState } from 'react';
import { db } from '../firebase'; // Asegúrate de importar la instancia de Firestore
import { collection, addDoc } from 'firebase/firestore'; // Importa las funciones de Firestore
import './VacationForm.css';

const VacationForm = () => {
    const [days, setDays] = useState('');
    const [startDate, setStartDate] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validación (opcional)
        const today = new Date().toISOString().split('T')[0];
        if (startDate < today) {
            setMessage('La fecha de inicio debe ser hoy o en el futuro.');
            return;
        }

        // Guardar la solicitud en Firestore
        try {
            await addDoc(collection(db, 'vacaciones'), {
                days: Number(days),
                startDate: startDate,
            });
            setMessage(`Solicitud enviada: ${days} día(s) desde ${startDate}.`);
            setDays('');
            setStartDate('');
        } catch (error) {
            setMessage('Error al enviar la solicitud. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="vacation-form-container">
            <nav className="navbar">
                <a className="navbar-brand" href="#">Mi Empresa</a>
                <div className="navbar-menu">
                    <a className="nav-link" href="#">Inicio</a>
                    <a className="nav-link" href="#">Perfil</a>
                    <a className="nav-link" href="#">Solicitudes</a>
                    <a className="nav-link" href="#">Cerrar Sesión</a>
                </div>
            </nav>
            <div className="container">
                <h1>Bienvenido al Sistema de Solicitudes de Vacaciones</h1>
                <p>Aquí puedes solicitar tus días de vacaciones y ver el estado de tus solicitudes.</p>
                <div className="form-container">
                    <div className="card">
                        <h2>Formulario de Vacaciones</h2>
                        <form onSubmit={handleSubmit}>
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
                                        <option key={i + 1} value={i + 1}>{i + 1} día(s)</option>
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
                            <button type="submit" className="submit-button">Enviar Solicitud</button>
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
