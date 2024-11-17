import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  // Obtener las solicitudes al cargar el componente
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      const querySnapshot = await getDocs(collection(db, "vacaciones"));
      const solicitudesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSolicitudes(solicitudesArray);
    };
    obtenerSolicitudes();
  }, []);

  // Función para aceptar la solicitud
  const aceptarSolicitud = async (id) => {
    const solicitudRef = doc(db, "vacaciones", id);
    await updateDoc(solicitudRef, { status: "aceptado" });
    setSolicitudes(
      solicitudes.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, status: "aceptado" } : solicitud
      )
    );
  };

  // Función para rechazar la solicitud
  const rechazarSolicitud = async (id) => {
    const solicitudRef = doc(db, "vacaciones", id);
    await updateDoc(solicitudRef, { status: "rechazado" });
    setSolicitudes(
      solicitudes.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, status: "rechazado" } : solicitud
      )
    );
  };

  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">
        Panel de Administración de Solicitudes
      </h2>
      <ul className="solicitud-list">
        {solicitudes.map((solicitud) => (
          <li key={solicitud.id} className="solicitud-item">
            <p className="solicitud-details">
              <strong>Email:</strong> {solicitud.email}{" "}
            </p>
            <p className="solicitud-details">
              <strong>Nombre:</strong> {solicitud.name} {solicitud.surname}
            </p>
            <p className="solicitud-details">
              <strong>Años:</strong> {solicitud.age}{" "}
            </p>
            <p className="solicitud-details">
              <strong>Años de Antiguedad:</strong> {solicitud.seniority}{" "}
            </p>
            <p className="solicitud-details">
              <strong>Días solicitados:</strong> {solicitud.days}
            </p>
            <p className="solicitud-details">
              <strong>Fecha de inicio:</strong> {solicitud.startDate}
            </p>
            <p className="solicitud-details">
              <strong>Estado:</strong>{" "}
              <span
                className={
                  solicitud.status === "aceptado"
                    ? "status-accepted"
                    : solicitud.status === "rechazado"
                    ? "status-rejected"
                    : "status-pending"
                }
              >
                {solicitud.status}
              </span>
            </p>
            {solicitud.status === "pendiente" && ( // Verifica que el estado en Firestore sea "pendiente"
              <div className="action-buttons">
                <button
                  className="accept-button"
                  onClick={() => aceptarSolicitud(solicitud.id)}
                >
                  Aceptar
                </button>
                <button
                  className="reject-button"
                  onClick={() => rechazarSolicitud(solicitud.id)}
                >
                  Rechazar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
