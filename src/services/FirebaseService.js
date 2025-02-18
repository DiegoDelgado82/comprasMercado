// src/services/FirebaseService.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Importa `db` directamente desde firebase.js

export const guardarEnFirebase = async (productos) => {
  try {
    const coleccionRef = collection(db, 'productos');
    
    for (const producto of productos) {
      await addDoc(coleccionRef, producto);
    }
    console.log('Productos guardados en Firebase');
  } catch (error) {
    console.error('Error al guardar en Firebase:', error);
  }
};
