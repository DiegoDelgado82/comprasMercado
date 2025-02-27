import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { guardarEnFirebase } from '../services/FirebaseService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaArrowLeft } from 'react-icons/fa';  // Icono para el botón de volver

const CargaExcel = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate(); // Hook para redireccionar

  // Función para procesar el archivo Excel
  const procesarArchivo = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const hoja = workbook.Sheets[workbook.SheetNames[0]];
      const datos = XLSX.utils.sheet_to_json(hoja, { header: 1 });

      const encabezados = datos[0];
      const productosProcesados = datos.slice(1).map((fila) => {
        const producto = {};
        fila.forEach((valor, index) => {
          producto[encabezados[index]] = valor;
        });
        return producto;
      });

      setProductos(productosProcesados);
      localStorage.setItem('productos', JSON.stringify(productosProcesados));
      guardarEnFirebase(productosProcesados);

      // Notificación con SweetAlert2
      Swal.fire({
        icon: 'success',
        title: '¡Carga exitosa!',
        text: 'Los datos se cargaron correctamente. En unos minutos estarán los datos disponibles',
        confirmButtonText: 'Aceptar',
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        {/* Botón para volver */}
        <button 
          className="btn btn-outline-secondary d-flex align-items-center mb-3"
          onClick={() => navigate('/')}
        >
          <FaArrowLeft className="me-2" /> Volver al Loguin
        </button>

        {/* Formulario de carga */}
        <h4 className="text-center mb-3">Carga de Productos desde Excel</h4>
        <input type="file" className="form-control mb-3" onChange={procesarArchivo} />
      </div>
    </div>
  );
};

export default CargaExcel;
