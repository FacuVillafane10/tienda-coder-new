import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Al cambiar de página vuelve arriba; si el link tiene #ancla (por ejemplo /#menu), baja hasta esa sección.
function Desplazamiento() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    // La sección puede tardar en aparecer (se carga desde Firebase): se reintenta un momento
    let intentos = 0;
    const timer = setInterval(() => {
      const destino = document.getElementById(hash.slice(1));
      intentos += 1;
      if (destino || intentos > 20) {
        clearInterval(timer);
        destino?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    return () => clearInterval(timer);
  }, [pathname, hash]);

  return null;
}

export default Desplazamiento;
