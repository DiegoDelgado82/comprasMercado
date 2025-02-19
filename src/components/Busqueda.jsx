import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Busqueda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Solo cargar productos de Firestore si no están en localStorage
    const productosGuardados = localStorage.getItem('productos');
    if (!productosGuardados) {
      fetchProductosFromFirestore();
    }
  }, []);

  const fetchProductosFromFirestore = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'productos'));
      if (querySnapshot.empty) {
        Swal.fire({
          icon: 'warning',
          title: 'No hay datos disponibles',
          text: 'Por favor, carga un archivo en la opción "Carga Excel".',
          confirmButtonText: 'Aceptar',
        });
      } else {
        const productosData = [];
        querySnapshot.forEach((doc) => {
          productosData.push({ ...doc.data(), id: doc.id });
        });
        localStorage.setItem('productos', JSON.stringify(productosData));
        setProductos(productosData); // Guardar productos solo si no estaban en localStorage
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setProductos([]); // Limpiar productos si no hay búsqueda
    } else {
      const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
      const resultados = productosGuardados.filter((producto) =>
        producto.Descripción?.toLowerCase().includes(searchTerm)
      );
      setProductos(resultados);
    }
  }, [searchTerm]);

  // Ordenar proveedores por costo
  const obtenerPreciosOrdenados = (producto) => {
    const proveedores = [
      { nombre: 'NIC', costo: producto.NIC },
      { nombre: 'AMAYA', costo: producto.AMAYA },
      { nombre: 'BORREGUITO', costo: producto.BORREGUITO },
      { nombre: 'JALIL', costo: producto.JALIL },
      { nombre: 'LOS GRINGOS', costo: producto.LOS_GRINGOS },
      { nombre: 'PARIS', costo: producto.PARIS },
      { nombre: 'SCHAVONI', costo: producto.SCHAVONI },
    ];

    const preciosOrdenados = proveedores
      .filter((prov) => prov.costo)
      .sort((a, b) => a.costo - b.costo);

    return preciosOrdenados;
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center">Buscar Producto</h2>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Buscar por descripción"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {loading && <p className="text-center">Cargando datos...</p>}

      {productos.length > 0 ? (
        <div>
          <h3 className="text-center">Resultados</h3>
          {productos.map((producto) => {
            const preciosOrdenados = obtenerPreciosOrdenados(producto);
            const mejorProveedor = preciosOrdenados[0];

            return (
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
                      {preciosOrdenados.map((prov, index) => {
                        const isBestPrice = prov === mejorProveedor;
                        return (
                          <tr
                            key={index}
                            style={{
                              backgroundColor: isBestPrice ? '#e0f7fa' : 'white',
                              fontWeight: isBestPrice ? 'bold' : 'normal',
                            }}
                          >
                            <td>
                              {prov.nombre} {isBestPrice && <FaStar className="text-warning ms-2" />}
                            </td>
                            <td>{Math.round(prov.costo)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && searchTerm && <p className="text-center">No se encontraron resultados.</p>
      )}

      <button
        className="btn btn-outline-secondary d-flex align-items-center mb-3"
        onClick={() => navigate('/dashboard')}
      >
        <FaArrowLeft className="me-2" /> Volver al Dashboard
      </button>
    </div>
  );
};

export default Busqueda;
