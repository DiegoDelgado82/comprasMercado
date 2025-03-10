import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Busqueda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    } else {
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
        const productosData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        localStorage.setItem('productos', JSON.stringify(productosData));
        setProductos(productosData);
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setProductos([]);
    } else {
      const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
      const resultados = productosGuardados.filter((producto) =>
        producto.Descripción?.toLowerCase().includes(searchTerm)
      );
      setProductos(resultados);
    }
  }, [searchTerm]);

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

    return proveedores.filter((prov) => prov.costo).sort((a, b) => a.costo - b.costo);
  };

  const handleNegociar = (producto) => {
    Swal.fire({
      title: 'Negociación de Precio',
      html: `
        <select id="proveedor" class="swal2-input">
          <option value="AMAYA">AMAYA</option>
          <option value="BORREGUITO">BORREGUITO</option>
          <option value="JALIL">JALIL</option>
          <option value="LOS GRINGOS">LOS GRINGOS</option>
          <option value="PARIS">PARIS</option>
          <option value="SCHAVONI">SCHAVONI</option>
        </select>
        <input type="number" id="costo" class="swal2-input" placeholder="Costo Negociado">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: () => {
        const proveedor = document.getElementById('proveedor').value;
        const costo = document.getElementById('costo').value.trim();
        
        if (!costo || isNaN(costo) || parseFloat(costo) <= 0) {
          Swal.showValidationMessage('Debe ingresar un costo válido');
          return false;
        }
        
        return { proveedor, costo: parseFloat(costo) };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ Aseguramos que negociaciones sea siempre un array
        let negociaciones = JSON.parse(localStorage.getItem('negociaciones')) || [];
  
        // Si negociaciones no es un array, lo convertimos en uno
        if (!Array.isArray(negociaciones)) {
          negociaciones = [];
        }
  
        // Agregar nueva negociación con el formato correcto
        negociaciones.push({
          EAN: producto.EAN,
          Descripción: producto.Descripción,
          Costo: result.value.costo.toFixed(2),
          Proveedor: result.value.proveedor
        });
  
        // Guardar en localStorage
        localStorage.setItem('negociaciones', JSON.stringify(negociaciones));
  
        Swal.fire('Guardado', 'Negociación agregada correctamente', 'success');
      }
    });
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
            return (
              <div key={producto.id} className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">EAN: {producto.EAN}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Descripción: {producto.Descripción}</h6>
                  <h6 className="card-subtitle mb-2 text-muted"><b>PVP: ${producto.PRECIO}</b></h6>
                  <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th>Proveedor</th>
                        <th>Costo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preciosOrdenados.map((prov, index) => (
                        <tr key={index}>
                          <td>{prov.nombre}</td>
                          <td>${prov.costo.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className="btn btn-warning mt-2"
                    onClick={() => handleNegociar(producto)}
                  >
                    Para Negociar
                  </button>
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
        onClick={() => navigate('/')}
      >
        <FaArrowLeft className="me-2" /> Volver al Loguin
      </button>
    </div>
  );
};

export default Busqueda;
