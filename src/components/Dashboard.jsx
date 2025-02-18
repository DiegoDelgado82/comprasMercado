// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener el usuario autenticado de Firebase
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bienvenido, {user.email || 'Usuario'}</h2>
      

      <div className="d-grid gap-3">
        <Link to="/carga-precios" className="btn btn-primary btn-lg">Cargar Archivo de Precios</Link>
        <Link to="/busqueda-costos" className="btn btn-success btn-lg">Búsqueda de Costos</Link>
        <Link to="/gestionar-pedidos" className="btn btn-warning btn-lg">Gestionar Pedidos</Link>
        <Link to="/historico-precios" className="btn btn-info btn-lg text-white">Histórico de Precios</Link>
      </div>
    </div>
  );
};

export default Dashboard;
