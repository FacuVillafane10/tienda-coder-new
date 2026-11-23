import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './auth';

const mensajeDeError = (codigo) => {
  switch (codigo) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'El email o la contraseña no son correctos.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Esperá unos minutos y volvé a probar.';
    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
      return 'El acceso todavía no está activado en Firebase (Authentication → Correo electrónico/contraseña).';
    case 'auth/network-request-failed':
      return 'No hay conexión. Revisá internet y volvé a intentar.';
    default:
      return 'No se pudo iniciar sesión. Intentá de nuevo.';
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const ingresar = async (e) => {
    e.preventDefault();
    setError('');
    setAviso('');
    setEnviando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(mensajeDeError(err.code));
    } finally {
      setEnviando(false);
    }
  };

  const recuperar = async () => {
    setError('');
    setAviso('');
    if (!email.trim()) {
      setError('Escribí tu email y después tocá "Olvidé mi contraseña".');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch {
      // No se informa si el email existe o no
    }
    setAviso('Si el email está registrado, te llega un correo para elegir una contraseña nueva.');
  };

  return (
    <div className="contenedor seccion admin-login">
      <h2 className="admin-login__titulo">Administrar tienda</h2>
      <form onSubmit={ingresar} className="panel-caja">
        <label className="form-label" htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          type="email"
          className="form-control mb-3"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="form-label" htmlFor="admin-password">Contraseña</label>
        <input
          id="admin-password"
          type="password"
          className="form-control mb-3"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {aviso && <div className="alert alert-success py-2">{aviso}</div>}

        <button type="submit" className="boton boton--primario boton--ancho" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
        <button type="button" className="boton boton--fantasma boton--ancho mt-2" onClick={recuperar}>
          Olvidé mi contraseña
        </button>
      </form>
    </div>
  );
};

export default Login;
