import { Link } from 'react-router-dom';

const VALORES = [
  { icono: 'bi-house-heart', titulo: 'Casero de verdad', texto: 'Cocinamos como en casa: recetas de siempre, sin atajos.' },
  { icono: 'bi-basket2', titulo: 'Ingredientes frescos', texto: 'Elegimos ingredientes de primera calidad para cada plato.' },
  { icono: 'bi-truck', titulo: 'Directo a vos', texto: 'Llevamos tu pedido a tu casa, empresa o lugar de trabajo.' },
];

export default function Nosotros() {
  return (
    <div className="contenedor seccion">
      <div className="nosotros">
        <img src="/logoPau.jpeg" alt="Logo de Paula Foods" className="nosotros__logo" />
        <div className="nosotros__texto">
          <span className="etiqueta-seccion">Sobre nosotros</span>
          <h1 className="titulo-seccion">Comida casera, hecha con amor</h1>
          <p>
            En Paula Foods nos dedicamos a llevarte lo mejor de la comida casera, hecha con amor, directamente a tu
            casa, empresa o trabajo.
          </p>
          <p>
            Sabemos que lo que necesitás es algo rápido, rico y de calidad: por eso preparamos cada plato con
            ingredientes frescos y de primera.
          </p>
          <p>¡Gracias por elegirnos!</p>
          <div>
            <Link to="/#menu" className="boton boton--primario">Ver el menú</Link>
          </div>
        </div>
      </div>

      <div className="valores">
        {VALORES.map((v) => (
          <div key={v.titulo} className="valor">
            <i className={`bi ${v.icono}`} aria-hidden="true"></i>
            <h3>{v.titulo}</h3>
            <p>{v.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
