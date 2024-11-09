import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';

const AdminPanel = () => {
    const [requests, setRequests] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            const requestsCollection = collection(db, 'vacaciones');
            const requestSnapshot = await getDocs(requestsCollection);
            const requestList = requestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(requestList);
        };

        const checkAdminRole = async () => {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsAdmin(userData.role === 'admin'); // Verifica si el rol es admin
                }
            }
        };

        fetchRequests();
        checkAdminRole();
    }, []);

    const handleAccept = async (id) => {
        const requestDoc = doc(db, 'vacaciones', id);
        await updateDoc(requestDoc, { status: 'accepted' });
        setRequests(requests.map(req => (req.id === id ? { ...req, status: 'accepted' } : req)));
    };

    const handleReject = async (id) => {
        const requestDoc = doc(db, 'vacaciones', id);
        await updateDoc(requestDoc, { status: 'rejected' });
        setRequests(requests.map(req => (req.id === id ? { ...req, status: 'rejected' } : req)));
    };

    if (!isAdmin) {
        return <div>No tienes permiso para acceder a este panel.</div>; // Mensaje para usuarios no autorizados
    }

    return (
        <div>
            <h1>Panel de Administración</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Días</th>
                        <th>Fecha de Inicio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.id}</td>
                            <td>{request.email}</td>
                            <td>{request.days}</td>
                            <td>{request.startDate}</td>
                            <td>{request.status || 'pending'}</td>
                            <td>
                                <button onClick={() => handleAccept(request.id)}>Aceptar</button>
                                <button onClick={() => handleReject(request.id)}>Rechazar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
