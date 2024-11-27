import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { db } from "../firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import "react-calendar/dist/Calendar.css";
import "./AdminSolicitudes.css";

const AdminSolicitudes = () => {
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsCollection = collection(db, "vacaciones");

        // Consulta para obtener todas las solicitudes
        const requestSnapshot = await getDocs(requestsCollection);
        const requestList = requestSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRequests(requestList);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    };

    fetchRequests();
  }, []);

  // Función para aplicar clases a las fechas del calendario
  const tileClassName = (request, date, view) => {
    if (view === "month") {
      const today = new Date();
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);

      // Días dentro del rango de vacaciones
      if (date >= startDate && date <= endDate) {
        // Si la fecha ha pasado, marcarla como roja
        if (date < today) {
          return "past-days";
        }
        // Si la fecha aún está por venir, marcarla como verde
        else {
          return "vacation-days";
        }
      }
    }
  };

  // Función para determinar el color de fondo de la tarjeta según el estado
  const getStatusClass = (status) => {
    switch (status) {
      case "aceptado":
        return "accepted";
      case "rechazado":
        return "rejected";
      case "pendiente":
        return "pending";
      default:
        return "";
    }
  };

  // Función para aceptar una solicitud
  const aceptarSolicitud = async (id) => {
    const solicitudRef = doc(db, "vacaciones", id);
    await updateDoc(solicitudRef, { status: "aceptado" });
    setRequests(
      requests.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, status: "aceptado" } : solicitud
      )
    );
  };

  // Función para rechazar una solicitud
  const rechazarSolicitud = async (id) => {
    const solicitudRef = doc(db, "vacaciones", id);
    await updateDoc(solicitudRef, { status: "rechazado" });
    setRequests(
      requests.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, status: "rechazado" } : solicitud
      )
    );
  };

  return (
    <div className="admin-solicitudes">
      <h2>Administración de Solicitudes</h2>
      {requests.length === 0 ? (
        <p>No hay solicitudes de vacaciones.</p>
      ) : (
        <div className="requests-container">
          {requests.map((request) => (
            <div
              className={`request-card ${getStatusClass(request.status)}`}
              key={request.id}
            >
              <h3>Solicitud de Vacaciones</h3>
              <p>
                <strong>Email:</strong> {request.email}
              </p>
              <p>
                <strong>Nombre:</strong> {request.name} {request.surname}
              </p>
              <p>
                <strong>Años:</strong> {request.age}
              </p>
              <p>
                <strong>Años de Antigüedad:</strong> {request.seniority}
              </p>
              <p>
                <strong>Días solicitados:</strong> {request.days}
              </p>
              <p>
                <strong>Fecha de inicio:</strong> {request.startDate}
              </p>
              <p>
                <strong>Fecha de finalización:</strong> {request.endDate}
              </p>
              <p>
                <strong>Estado:</strong> {request.status || "pendiente"}
              </p>

              <div className="calendar-container">
                <Calendar
                  tileClassName={({ date, view }) =>
                    tileClassName(request, date, view)
                  }
                />
              </div>

              <div className="actions">
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSolicitudes;
