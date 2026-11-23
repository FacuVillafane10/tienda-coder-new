import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIAS } from '../utils/categorias';
import { WHATSAPP_POR_DEFECTO, obtenerWhatsApp } from '../utils/config';

function Pie() {
  const [whatsapp, setWhatsapp] = useState(WHATSAPP_POR_DEFECTO);

  useEffect(() => {
    obtenerWhatsApp().then(setWhatsapp);
  }, []);

  return (
    <footer className="pie">
      <div className="contenedor">
        <div className="pie__interior">
          <div>
            <div className="pie__marca">
              <img src="/logoPau.jpeg" alt="" />
              <span>Paula Foods</span>
            </div>
            <p>Comida casera, hecha con amor, directo a tu casa, empresa o trabajo.</p>
          </div>

          <div>
            <h4>Menú</h4>
            <ul>
              {CATEGORIAS.map((c) => (
                <li key={c.clave}>
                  <Link to={`/categorias/${c.clave}`}>{c.nombre}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contacto</h4>
            <ul>
              <li>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-whatsapp" aria-hidden="true"></i> Escribinos por WhatsApp
                </a>
              </li>
              <li>
                <Link to="/nosotros">Sobre nosotros</Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="pie__legal">© {new Date().getFullYear()} Paula Foods. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Pie;
