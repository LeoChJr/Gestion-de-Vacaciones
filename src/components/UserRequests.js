import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Asegúrate de importar la instancia de Firestore
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./UserRequests.css"; // Asegúrate de que la ruta sea correcta

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const { currentUser } = useAuth(); // Usar currentUser en lugar de user

  useEffect(() => {
    const fetchUserRequests = async () => {
      console.log("Usuario:", currentUser); // Verifica si el usuario está autenticado
      if (!currentUser) {
        console.log("No hay usuario autenticado.");
        return; // Si no hay usuario, no hacer nada
      }

      try {
        const requestsCollection = collection(db, "vacaciones");
        const q = query(
          requestsCollection,
          where("userId", "==", currentUser.uid)
        );
        const requestSnapshot = await getDocs(q);

        if (requestSnapshot.empty) {
          console.log("No se encontraron solicitudes para este usuario.");
        } else {
          console.log("Documentos encontrados:", requestSnapshot.docs.length); // Número de documentos encontrados
        }

        const requestList = requestSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRequests(requestList);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    };

    fetchUserRequests();
  }, [currentUser]); // Agregar dependencia a currentUser para ejecutar la consulta solo cuando el usuario cambia

  return (
    <div className="user-requests">
      <h2>Mis Solicitudes</h2>
      {requests.length === 0 ? (
        <p>No tienes solicitudes de vacaciones.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserRequests;
