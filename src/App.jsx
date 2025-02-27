import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CargaExcel from './components/CargaExcel';
import Busqueda from './components/Busqueda';
import ListaNegociaciones from "./components/ListaNegociaciones";
import 'bootstrap/dist/css/bootstrap.min.css';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Ruta raíz */}
        <Route path="*" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/carga-precios" element={<CargaExcel />} />
        <Route path="/busqueda-costos" element={<Busqueda />} />
        <Route path="/Lista-Negociaciones" element={<ListaNegociaciones/>} />
        <Route path="/historico-precios" element={<div>Histórico de Precios (En desarrollo)</div>} />
        {/* Otras rutas */}
      </Routes>
    </Router>
  );
};

export default App;
