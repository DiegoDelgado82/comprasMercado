import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Asegúrate de que la ruta de tu archivo firebase.js sea correcta
import { useNavigate } from 'react-router-dom'; // Si usas React Router para redirigir después del login

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Si quieres redirigir al usuario después de iniciar sesión

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Resetea el error antes de intentar el login
    try {
      // Intentamos iniciar sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado:', userCredential.user);
      
      // Si la autenticación es exitosa, redirige al usuario al dashboard o a la página principal
      navigate('/dashboard'); // Aquí puedes cambiar la ruta de destino según tu app

    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message); // Muestra el error al usuario
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Introduce tu correo" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Introduce tu contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>

        <button type="submit" className="login-btn">Iniciar sesión</button>

        {error && <p className="error-message">{error}</p>} {/* Muestra el error si existe */}
      </form>
    </div>
  );
};

export default Login;
