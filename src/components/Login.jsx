import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado:', userCredential.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
     <div className="card shadow p-4" style={{ width: "350px" }}>
        {/* Logo */}
        <div className="text-center mb-3">
          <img 
            src="/elmercadologo.png"
            alt="Logo"
            className="img-fluid"
            style={{ maxHeight: '90px' }} 
          />
        </div>

        {/* Formulario de Login */}
        <h4 className="text-center mb-3">Iniciar sesión</h4>
        <form onSubmit={handleLogin}>
          <div className="mb-2">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Introduce tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón de Iniciar Sesión */}
          <button type="submit" className="btn btn-primary w-100">Ingresar</button>

          {/* Mensaje de error */}
          {error && <p className="text-danger text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
