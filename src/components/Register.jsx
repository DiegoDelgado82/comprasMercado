import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Verificar si el correo está habilitado en Firestore (opcional)
      const docRef = doc(db, 'allowedEmails', email);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setErrorMessage('Este correo no está habilitado para el registro.');
        return;
      }

      // Crear el usuario en Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      setErrorMessage('Registro exitoso');
      navigate('/dashboard');  // Redirige al dashboard después del registro exitoso
    } catch (error) {
      setErrorMessage('Error al registrar: ' + error.message);
      console.error('Error al registrar:', error.message);
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
