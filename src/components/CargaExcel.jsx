// src/components/CargaExcel.jsx
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { guardarEnFirebase } from '../services/FirebaseService';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';  // Importa SweetAlert2

const CargaExcel = () => {
  const [productos, setProductos] = useState([]);

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

      // SweetAlert2 en lugar de alert()
      Swal.fire({
        icon: 'success',
        title: '¡Carga exitosa!',
        text: 'Los datos se cargaron correctamente.',
        confirmButtonText: 'Aceptar',
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="card p-4 mt-4">
      <h3>Carga de Productos desde Excel</h3>
      <input type="file" className="form-control mt-3" onChange={procesarArchivo} />
      <Link to="/Dashboard" className="btn btn-primary mt-3">Volver al Dashboard</Link>
    </div>
  );
};

export default CargaExcel;
