import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";

const ListaNegociaciones = () => {
  const [negociaciones, setNegociaciones] = useState([]);

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("negociaciones")) || [];
    setNegociaciones(datosGuardados);
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(negociaciones);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Negociaciones");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Negociaciones.xlsx");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Lista de Negociaciones</h2>
      <button className="btn btn-success mb-3" onClick={exportToExcel}>Descargar Excel</button>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>EAN</th>
              <th>Descripción</th>
              <th>Costo</th>
              <th>Proveedor</th>
            </tr>
          </thead>
          <tbody>
            {negociaciones.length > 0 ? (
              negociaciones.map((negociacion, index) => (
                <tr key={index}>
                  <td>{negociacion.EAN}</td>
                  <td>{negociacion.Descripción}</td>
                  <td>${negociacion.Costo}</td>
                  <td>{negociacion.Proveedor}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No hay negociaciones guardadas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaNegociaciones;
