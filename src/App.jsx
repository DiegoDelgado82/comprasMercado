import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CargaExcel from './components/CargaExcel';
import Busqueda from './components/Busqueda';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Ruta raíz */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/carga-precios" element={<CargaExcel />} />
        <Route path="/busqueda-costos" element={<Busqueda />} />
        <Route path="/gestionar-pedidos" element={<div>Gestionar Pedidos (En desarrollo)</div>} />
        <Route path="/historico-precios" element={<div>Histórico de Precios (En desarrollo)</div>} />
        {/* Otras rutas */}
      </Routes>
    </Router>
  );
};

export default App;
