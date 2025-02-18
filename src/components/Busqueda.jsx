// src/components/Busqueda.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
const Busqueda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para buscar productos en Firestore
  const fetchProductos = async (term) => {
    setLoading(true);
    const q = query(
      collection(db, 'productos'),
      where('Descripción', '>=', term),
      where('Descripción', '<=', term + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    const productosData = [];
    querySnapshot.forEach((doc) => {
      productosData.push({ ...doc.data(), id: doc.id });
    });
    setProductos(productosData);
    setLoading(false);
  };

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() !== '') {
      fetchProductos(value);
    } else {
      setProductos([]);
    }
  };

  // Función para obtener los precios ordenados por proveedor
  const obtenerPreciosOrdenados = (producto) => {
    const proveedores = [
      { nombre: 'NIC', costo: producto.NIC },
      { nombre: 'AMAYA', costo: producto.AMAYA },
      { nombre: 'BORREGUITO', costo: producto.BORREGUITO },
      { nombre: 'JALIL', costo: producto.JALIL },
      { nombre: 'LOS GRINGOS', costo: producto.LOS_GRINGOS },
      { nombre: 'PARIS', costo: producto.PARIS },
      { nombre: 'SCHAVONI', costo: producto.SCHAVONI }
    ];

    // Filtrar proveedores sin costo y ordenar por costo ascendente
    const preciosOrdenados = proveedores
      .filter(prov => prov.costo) // Eliminar proveedores sin costo
      .sort((a, b) => a.costo - b.costo);

    return preciosOrdenados;
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Buscar Producto</h2>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Buscar por fragmento de descripción"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      
      {/* Mostrar indicador de carga */}
      {loading && <p className="text-center">Buscando...</p>}

      {productos.length > 0 && (
        <div>
          <h3 className="text-center">Resultados de Búsqueda</h3>
          {productos.map((producto) => (
            <div key={producto.id} className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">EAN: {producto.EAN}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Descripción: {producto.Descripción}
                </h6>
                <table className="table table-striped table-bordered">
                  <thead className="thead-dark">
                    <tr>
                      <th>Proveedor</th>
                      <th>Costo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obtenerPreciosOrdenados(producto).map((prov, index) => (
                      <tr key={index}>
                        <td>{prov.nombre}</td>
                        <td>{Math.round(prov.costo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Si no hay resultados */}
      {productos.length === 0 && searchTerm && !loading && (
        <p className="text-center">No se encontraron resultados.</p>
      )}
        <Link to="/Dashboard" className="btn btn-primary mt-3">Volver al Dashboard</Link>
    </div>
  );
};

export default Busqueda;
