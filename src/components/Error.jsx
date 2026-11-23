import { Link } from 'react-router-dom';

const Error = () => (
  <div className="contenedor">
    <div className="error-pagina">
      <div className="error-pagina__numero">404</div>
      <h1>No encontramos esta página</h1>
      <p>Puede que el link esté mal escrito o que la página ya no exista.</p>
      <Link to="/" className="boton boton--primario">Volver al inicio</Link>
    </div>
  </div>
);

export default Error;
