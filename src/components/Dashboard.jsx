import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import CargaExcel from './CargaExcel';
import Busqueda from './Busqueda';
import Lista from './ListaNegociaciones'

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  if (!user) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div className="container-fluid d-flex flex-column min-vh-100 justify-content-start align-items-center mt-2">
      {/* Si hay un componente activo, solo lo mostramos sin el Dashboard */}
      {activeComponent === 'carga' && <CargaExcel onVolver={() => setActiveComponent(null)} />}
      {activeComponent === 'busqueda' && <Busqueda onVolver={() => setActiveComponent(null)} />}
      {activeComponent === 'lista' && <Lista onVolver={() => setActiveComponent(null)} />}

      {/* Si NO hay un componente activo, mostramos el Dashboard */}
      {!activeComponent && (
        <>
          {/* Header con Logo */}
          <div className="text-center mb-3">
            <img src="/elmercadologo.png" alt="Logo" className="img-fluid" style={{ maxHeight: '80px' }} />
          </div>

          {/* Información del Usuario */}
          <div className="card p-3 mb-3 text-center w-100">
            <h4>Bienvenido, {user.email || 'Usuario'}</h4>
          </div>

          {/* Botones de Navegación */}
          <div className="d-grid gap-3 w-100">
            <button className="btn btn-primary" onClick={() => setActiveComponent('carga')}>📂 Cargar Archivo de Precios</button>
            <button className="btn btn-success" onClick={() => setActiveComponent('busqueda')}>🔍 Búsqueda de Costos</button>
            <button className="btn btn-warning" onClick={() => setActiveComponent('lista')}>🔍 Lista de Negociaciones</button>
          
            <button className="btn btn-secondary">📊 Histórico de Precios (Próximamente)</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
