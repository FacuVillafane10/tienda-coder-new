import { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './auth';
import Login from './Login';
import './admin.css';

// Envuelve todas las rutas /admin: sin sesión muestra el login.
// La seguridad real está en firestore.rules: solo la cuenta de la dueña puede escribir.
const RutaAdmin = () => {
  const [usuario, setUsuario] = useState(undefined); // undefined = todavía verificando

  useEffect(() => onAuthStateChanged(auth, setUsuario), []);

  if (usuario === undefined) {
    return <div className="contenedor seccion text-center">Cargando...</div>;
  }

  if (!usuario) {
    return <Login />;
  }

  return (
    <div className="contenedor seccion admin">
      <div className="admin-barra">
        <span className="text-muted small text-truncate">Sesión: {usuario.email}</span>
        <button className="boton boton--secundario boton--chico" onClick={() => signOut(auth)}>
          <i className="bi bi-box-arrow-right"></i> Cerrar sesión
        </button>
      </div>
      <Suspense fallback={<p className="text-center">Cargando...</p>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RutaAdmin;
