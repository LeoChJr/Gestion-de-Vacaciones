import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import "./AdminPanel.css";
import { getAuth, signOut } from "firebase/auth"; // Importar Firebase Auth
import { Link } from "react-router-dom"; // Para manejar la navegación entre páginas

const AdminPanel = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [editandoId, setEditandoId] = useState(null); // ID de la solicitud en edición
  const [datosEditados, setDatosEditados] = useState({}); // Datos editados temporalmente

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

  const cerrarSesion = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada correctamente");
        window.location.href = "/login"; // Redirigir a la página de login
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

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

  // Función para eliminar la solicitud
  const eliminarSolicitud = async (id) => {
    const solicitudRef = doc(db, "vacaciones", id);
    await deleteDoc(solicitudRef);
    setSolicitudes(solicitudes.filter((solicitud) => solicitud.id !== id));
  };

  // Función para guardar los cambios después de editar
  const guardarCambios = async (id) => {
    const solicitudRef = doc(db, "vacaciones", id);
    await updateDoc(solicitudRef, datosEditados);
    setSolicitudes(
      solicitudes.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, ...datosEditados } : solicitud
      )
    );
    setEditandoId(null); // Salir del modo de edición
    setDatosEditados({});
  };

  // Función para manejar el cambio de valores en el formulario de edición
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosEditados({ ...datosEditados, [name]: value });
  };

  // Función para entrar en el modo de edición y restaurar el estado a "pendiente"
  const modificarSolicitud = async (id) => {
    const solicitudRef = doc(db, "vacaciones", id);
    await updateDoc(solicitudRef, { status: "pendiente" });
    setSolicitudes(
      solicitudes.map((solicitud) =>
        solicitud.id === id ? { ...solicitud, status: "pendiente" } : solicitud
      )
    );
    setEditandoId(id); // Activar el modo de edición
    setDatosEditados(solicitudes.find((solicitud) => solicitud.id === id));
  };

  return (
    <div className="admin-panel-container">
      <nav className="navbar">
        <h2 className="navbar-title">Panel de Administración</h2>
        <div className="navbar-links">
          <Link to="/user-panel" className="nav-link">
            Panel de Usuario
          </Link>
          <Link to="/AdminSolis" className="nav-link">
            Solicitudes
          </Link>
          <button className="logout-button" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <h2 className="admin-panel-title">Panel de Administración de Solicitudes</h2>

      <table className="solicitudes-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Edad</th>
            <th>Antigüedad</th>
            <th>Días Solicitados</th>
            <th>Fecha de Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id}>
              {editandoId === solicitud.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="email"
                      defaultValue={solicitud.email}
                      onChange={manejarCambio}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      defaultValue={solicitud.name}
                      onChange={manejarCambio}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="surname"
                      defaultValue={solicitud.surname}
                      onChange={manejarCambio}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="age"
                      defaultValue={solicitud.age}
                      onChange={manejarCambio}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="seniority"
                      defaultValue={solicitud.seniority}
                      onChange={manejarCambio}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="days"
                      defaultValue={solicitud.days}
                      onChange={manejarCambio}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="startDate"
                      defaultValue={solicitud.startDate}
                      onChange={manejarCambio}
                    />
                  </td>
                  <td>
                    {/** Fecha Fin Calculada */}
                    {solicitud.startDate && solicitud.days ? (
                      new Date(
                        new Date(solicitud.startDate).setDate(
                          new Date(solicitud.startDate).getDate() + solicitud.days
                        )
                      ).toLocaleDateString()
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{solicitud.status}</td>
                  <td>
                    <button
                      className="save-button"
                      onClick={() => guardarCambios(solicitud.id)}
                    >
                      Guardar
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => setEditandoId(null)}
                    >
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{solicitud.email}</td>
                  <td>{solicitud.name}</td>
                  <td>{solicitud.surname}</td>
                  <td>{solicitud.age}</td>
                  <td>{solicitud.seniority}</td>
                  <td>{solicitud.days}</td>
                  <td>{solicitud.startDate}</td>
                  <td>
                    {/** Fecha Fin Calculada */}
                    {solicitud.startDate && solicitud.days ? (
                      new Date(
                        new Date(solicitud.startDate).setDate(
                          new Date(solicitud.startDate).getDate() + solicitud.days
                        )
                      ).toLocaleDateString()
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td
                    className={
                      solicitud.status === "aceptado"
                        ? "status-accepted"
                        : solicitud.status === "rechazado"
                        ? "status-rejected"
                        : "status-pending"
                    }
                  >
                    {solicitud.status}
                  </td>
                  <td>
                    {solicitud.status === "pendiente" && (
                      <>
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
                      </>
                    )}
                    <button
                      className="edit-button"
                      onClick={() => modificarSolicitud(solicitud.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => eliminarSolicitud(solicitud.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
