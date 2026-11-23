import ItemListContainer from './ItemListContainer';

const PASOS = [
  { icono: 'bi-hand-index-thumb', titulo: 'Elegí tus comidas', texto: 'Mirá el menú y sumá al carrito lo que tengas ganas de comer.' },
  { icono: 'bi-bag-check', titulo: 'Armá tu pedido', texto: 'Ajustá las cantidades y revisá el total antes de confirmar.' },
  { icono: 'bi-whatsapp', titulo: 'Confirmalo por WhatsApp', texto: 'Te llega el pedido armado: lo enviás y coordinamos la entrega.' },
];

function Inicio() {
  return (
    <>
      <section className="portada">
        <div className="contenedor portada__interior">
          <div>
            <span className="portada__sello">
              <i className="bi bi-heart-fill" aria-hidden="true"></i> Hecho en casa, todos los días
            </span>
            <h1 className="portada__titulo">
              Comida casera, <em>hecha con amor</em>
            </h1>
            <p className="portada__bajada">
              Platos ricos y de calidad, preparados con ingredientes frescos y listos para llevar a tu casa, empresa
              o trabajo.
            </p>
            <div className="portada__acciones">
              <a href="#menu" className="boton boton--primario">
                Ver el menú <i className="bi bi-arrow-down" aria-hidden="true"></i>
              </a>
              <a href="#como-pedir" className="boton boton--secundario">
                ¿Cómo pido?
              </a>
            </div>
          </div>

          <div className="portada__collage" aria-hidden="true">
            <img src="/puchero.jpeg" alt="" className="portada__foto portada__foto--alta" />
            <img src="/tartitasVerdura.jpeg" alt="" className="portada__foto" />
            <img src="/polloGrillado.jpeg" alt="" className="portada__foto" />
          </div>
        </div>
      </section>

      <section id="como-pedir" className="seccion pasos">
        <div className="contenedor">
          <div className="pasos__cabecera">
            <span className="etiqueta-seccion">Así de fácil</span>
            <h2 className="titulo-seccion">Cómo pedir</h2>
            <p className="bajada-seccion">Sin registrarte ni descargar nada: elegís, armás el pedido y lo confirmás por WhatsApp.</p>
          </div>
          <ol className="pasos__lista">
            {PASOS.map((paso, i) => (
              <li key={paso.titulo} className="paso">
                <div className="paso__icono">
                  <i className={`bi ${paso.icono}`} aria-hidden="true"></i>
                  <span className="paso__numero">{i + 1}</span>
                </div>
                <div>
                  <h3>{paso.titulo}</h3>
                  <p>{paso.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ItemListContainer />
    </>
  );
}

export default Inicio;
