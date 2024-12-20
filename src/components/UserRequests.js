import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "react-calendar/dist/Calendar.css";
import "./UserRequests.css";

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserRequests = async () => {
      if (!currentUser) {
        console.log("No hay usuario autenticado.");
        return;
      }
  
      try {
        const requestsCollection = collection(db, "vacaciones");
  
        // Consulta por "userId"
        const qUserId = query(
          requestsCollection,
          where("userId", "==", currentUser.uid)
        );
        const requestSnapshotUserId = await getDocs(qUserId);
        const requestListUserId = requestSnapshotUserId.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Consulta por "uid"
        const qUid = query(
          requestsCollection,
          where("uid", "==", currentUser.uid)
        );
        const requestSnapshotUid = await getDocs(qUid);
        const requestListUid = requestSnapshotUid.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Combina las solicitudes de ambas consultas
        const allRequests = [...requestListUserId, ...requestListUid];
  
        // Eliminar duplicados si existen (si un documento aparece en ambas consultas)
        const uniqueRequests = allRequests.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
        );
  
        setRequests(uniqueRequests);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    };
  
    fetchUserRequests();
  }, [currentUser]);
  

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

  return (
    <div className="user-requests">
      <h2>Mis Solicitudes</h2>
      {requests.length === 0 ? (
        <p>No tienes solicitudes de vacaciones.</p>
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
              <Calendar
                tileClassName={({ date, view }) =>
                  tileClassName(request, date, view)
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRequests;
