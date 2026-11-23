import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../assets/service/firebase';
import { CATEGORIAS } from '../utils/categorias';
import { MAX_FOTOS, fotosRef, obtenerFotos } from '../utils/fotos';
import { comprimirImagen } from './comprimirImagen';
import { normalizarProducto, problemasDelProducto, mensajeErrorFirestore } from './productos';

const VACIO = { nombre: '', descripcion: '', precio: '', categoria: '', foto: '', disponible: true };

let contadorClaves = 0;
const nuevaClave = () => `f${Date.now()}-${contadorClaves++}`;

const ProductoForm = () => {
  const { id } = useParams();
  const esNuevo = !id;
  const navigate = useNavigate();

  const [producto, setProducto] = useState(VACIO); // producto.foto = portada
  // Galería: { clave, id (si ya está guardada), imagen, nueva }
  const [fotos, setFotos] = useState([]);
  const [borradas, setBorradas] = useState([]); // ids de fotos guardadas que se quitaron
  const [cargando, setCargando] = useState(!esNuevo);
  const [procesando, setProcesando] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState([]);

  useEffect(() => {
    if (esNuevo) return;
    const cargar = async () => {
      try {
        const snap = await getDoc(doc(db, 'productos', id));
        if (!snap.exists()) {
          setErrores(['Esta comida ya no existe.']);
          return;
        }
        const datos = snap.data();
        const galeria = await obtenerFotos(id);
        const lista = galeria.map((f) => ({ clave: f.id, id: f.id, imagen: f.imagen, nueva: false }));
        // Comidas anteriores a la galería: su foto todavía no está en la subcolección.
        // Se suma como foto nueva, así queda guardada en la galería al guardar.
        if (datos.foto && !lista.some((f) => f.imagen === datos.foto)) {
          lista.unshift({ clave: nuevaClave(), imagen: datos.foto, nueva: true });
        }
        setFotos(lista);
        setProducto({
          ...VACIO,
          ...datos,
          // Algunos productos viejos tienen el precio cargado como "Precio"
          precio: datos.precio ?? datos.Precio ?? '',
          disponible: datos.disponible !== false,
        });
      } catch {
        setErrores(['No se pudo cargar la comida.']);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id, esNuevo]);

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProducto((p) => ({ ...p, [campo]: valor }));
  };

  const agregarFotos = async (e) => {
    const archivos = [...(e.target.files || [])];
    e.target.value = '';
    if (archivos.length === 0) return;

    const lugar = MAX_FOTOS - fotos.length;
    const aProcesar = archivos.slice(0, lugar);
    const avisos = archivos.length > lugar
      ? [`Se pueden tener hasta ${MAX_FOTOS} fotos: se agregaron ${aProcesar.length} de las ${archivos.length} elegidas.`]
      : [];

    const nuevas = [];
    for (let i = 0; i < aProcesar.length; i++) {
      setProcesando(`Procesando foto ${i + 1} de ${aProcesar.length}...`);
      try {
        nuevas.push({ clave: nuevaClave(), imagen: await comprimirImagen(aProcesar[i]), nueva: true });
      } catch (err) {
        avisos.push(`${aProcesar[i].name}: ${err.message}`);
      }
    }
    setProcesando('');
    setErrores(avisos);

    if (nuevas.length > 0) {
      setFotos((lista) => [...lista, ...nuevas]);
      // Si todavía no había portada, la primera foto nueva pasa a serlo
      setProducto((p) => (p.foto ? p : { ...p, foto: nuevas[0].imagen }));
    }
  };

  const elegirPortada = (imagen) => {
    setProducto((p) => ({ ...p, foto: imagen }));
  };

  const quitarFoto = (foto) => {
    const restantes = fotos.filter((f) => f.clave !== foto.clave);
    setFotos(restantes);
    if (foto.id) setBorradas((b) => [...b, foto.id]);
    if (producto.foto === foto.imagen) {
      setProducto((p) => ({ ...p, foto: restantes[0]?.imagen || '' }));
    }
  };

  const moverFoto = (indice, direccion) => {
    const destino = indice + direccion;
    if (destino < 0 || destino >= fotos.length) return;
    const lista = [...fotos];
    [lista[indice], lista[destino]] = [lista[destino], lista[indice]];
    // Las fotos que cambian de lugar se vuelven a guardar con el orden nuevo
    setFotos(lista.map((f, i) => (i === indice || i === destino ? { ...f, movida: true } : f)));
  };

  const guardar = async (e) => {
    e.preventDefault();
    const problemas = problemasDelProducto(producto);
    if (problemas.length > 0) {
      setErrores(problemas.map((p) => (p === 'Falta la foto' ? 'Agregá al menos una foto' : p)));
      return;
    }
    setErrores([]);
    setGuardando(true);
    try {
      const ref = esNuevo ? doc(collection(db, 'productos')) : doc(db, 'productos', id);
      const lote = writeBatch(db); // todo se guarda junto: o se guarda todo o nada
      lote.set(ref, normalizarProducto(producto));
      borradas.forEach((fotoId) => lote.delete(doc(fotosRef(ref.id), fotoId)));
      const base = Date.now();
      fotos.forEach((f, i) => {
        if (f.nueva) {
          lote.set(doc(fotosRef(ref.id)), { imagen: f.imagen, orden: base + i });
        } else if (f.movida) {
          lote.set(doc(fotosRef(ref.id), f.id), { imagen: f.imagen, orden: base + i });
        }
      });
      await lote.commit();
      navigate('/admin');
    } catch (err) {
      setErrores([mensajeErrorFirestore(err)]);
      setGuardando(false);
    }
  };

  if (cargando) {
    return <p className="text-center">Cargando...</p>;
  }

  const lleno = fotos.length >= MAX_FOTOS;

  return (
    <form onSubmit={guardar} className="admin-form">
      <h2 className="mb-3">{esNuevo ? 'Agregar comida' : 'Editar comida'}</h2>

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-baseline mb-2">
          <span className="form-label mb-0">Fotos</span>
          <small className="text-muted">{fotos.length} de {MAX_FOTOS}</small>
        </div>

        {fotos.length === 0 ? (
          <div className="admin-form__foto admin-form__foto--vacia mb-2">Todavía no hay fotos</div>
        ) : (
          <>
            <p className="admin-galeria__ayuda">
              La foto con <i className="bi bi-star-fill"></i> es la portada: es la que se ve en el menú.
            </p>
            <ul className="admin-galeria">
              {fotos.map((f, i) => {
                const esPortada = f.imagen === producto.foto;
                return (
                  <li key={f.clave} className={`admin-galeria__item ${esPortada ? 'admin-galeria__item--portada' : ''}`}>
                    <img src={f.imagen} alt={`Foto ${i + 1}`} />
                    {esPortada && (
                      <span className="admin-galeria__sello"><i className="bi bi-star-fill"></i> Portada</span>
                    )}
                    <div className="admin-galeria__acciones">
                      {!esPortada && (
                        <button type="button" className="admin-galeria__boton admin-galeria__boton--portada" onClick={() => elegirPortada(f.imagen)} title="Usar como portada">
                          <i className="bi bi-star"></i><span>Usar como portada</span>
                        </button>
                      )}
                      <button type="button" className="admin-galeria__boton" onClick={() => moverFoto(i, -1)} disabled={i === 0} title="Mover antes" aria-label="Mover antes">
                        <i className="bi bi-arrow-left"></i>
                      </button>
                      <button type="button" className="admin-galeria__boton" onClick={() => moverFoto(i, 1)} disabled={i === fotos.length - 1} title="Mover después" aria-label="Mover después">
                        <i className="bi bi-arrow-right"></i>
                      </button>
                      <button type="button" className="admin-galeria__boton admin-galeria__boton--borrar" onClick={() => quitarFoto(f)} title="Quitar foto" aria-label="Quitar foto">
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <label className={`boton boton--secundario boton--ancho mt-2 ${procesando || lleno ? 'boton--deshabilitado' : ''}`}>
          <i className="bi bi-images"></i>{' '}
          {procesando || (lleno ? `Llegaste al máximo de ${MAX_FOTOS} fotos` : fotos.length ? 'Agregar más fotos' : 'Elegir fotos')}
          <input type="file" accept="image/*" multiple hidden onChange={agregarFotos} disabled={!!procesando || lleno} />
        </label>
        {!lleno && !procesando && <small className="text-muted d-block mt-1">Podés elegir varias a la vez.</small>}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="nombre">Nombre</label>
        <input id="nombre" className="form-control" maxLength={80} value={producto.nombre} onChange={cambiar('nombre')} />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="precio">Precio</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            id="precio"
            className="form-control"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={producto.precio}
            onChange={cambiar('precio')}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="categoria">Categoría</label>
        <select id="categoria" className="form-select" value={producto.categoria} onChange={cambiar('categoria')}>
          <option value="">Elegí una categoría</option>
          {CATEGORIAS.map((c) => (
            <option key={c.clave} value={c.clave}>{c.emoji} {c.nombre}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          className="form-control"
          rows={4}
          maxLength={600}
          value={producto.descripcion}
          onChange={cambiar('descripcion')}
        />
        {/precio\s*:?\s*\$/i.test(producto.descripcion) && (
          <small className="text-warning-emphasis d-block mt-1">
            <i className="bi bi-exclamation-triangle"></i> La descripción tiene un precio escrito. El precio ya se muestra
            aparte: conviene borrarlo de acá para que no quede desactualizado.
          </small>
        )}
      </div>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="disponible"
          checked={producto.disponible}
          onChange={cambiar('disponible')}
        />
        <label className="form-check-label" htmlFor="disponible">Disponible para pedir</label>
      </div>

      {errores.length > 0 && (
        <div className="alert alert-danger py-2">
          {errores.map((texto) => <div key={texto}>{texto}</div>)}
        </div>
      )}

      <div className="d-flex gap-2">
        <button type="submit" className="boton boton--primario flex-grow-1" disabled={guardando || !!procesando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
        <Link to="/admin" className="boton boton--secundario">Cancelar</Link>
      </div>
    </form>
  );
};

export default ProductoForm;
