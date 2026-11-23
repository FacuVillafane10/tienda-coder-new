import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../assets/service/firebase';
import { CATEGORIAS } from '../utils/categorias';
import { comprimirImagen, pesoEnKB } from './comprimirImagen';
import { normalizarProducto, problemasDelProducto, mensajeErrorFirestore } from './productos';

const VACIO = { nombre: '', descripcion: '', precio: '', categoria: '', foto: '', disponible: true };

const ProductoForm = () => {
  const { id } = useParams();
  const esNuevo = !id;
  const navigate = useNavigate();

  const [producto, setProducto] = useState(VACIO);
  const [cargando, setCargando] = useState(!esNuevo);
  const [procesandoFoto, setProcesandoFoto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState([]);

  useEffect(() => {
    if (esNuevo) return;
    getDoc(doc(db, 'productos', id))
      .then((snap) => {
        if (!snap.exists()) {
          setErrores(['Esta comida ya no existe.']);
          return;
        }
        const datos = snap.data();
        setProducto({
          ...VACIO,
          ...datos,
          // Algunos productos viejos tienen el precio cargado como "Precio"
          precio: datos.precio ?? datos.Precio ?? '',
          disponible: datos.disponible !== false,
        });
      })
      .catch(() => setErrores(['No se pudo cargar la comida.']))
      .finally(() => setCargando(false));
  }, [id, esNuevo]);

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProducto((p) => ({ ...p, [campo]: valor }));
  };

  const elegirFoto = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    setErrores([]);
    setProcesandoFoto(true);
    try {
      const foto = await comprimirImagen(archivo);
      setProducto((p) => ({ ...p, foto }));
    } catch (err) {
      setErrores([err.message]);
    } finally {
      setProcesandoFoto(false);
    }
  };

  const guardar = async (e) => {
    e.preventDefault();
    const problemas = problemasDelProducto(producto);
    if (problemas.length > 0) {
      setErrores(problemas);
      return;
    }
    setErrores([]);
    setGuardando(true);
    try {
      const datos = normalizarProducto(producto);
      if (esNuevo) {
        await addDoc(collection(db, 'productos'), datos);
      } else {
        await setDoc(doc(db, 'productos', id), datos);
      }
      navigate('/admin');
    } catch (err) {
      setErrores([mensajeErrorFirestore(err)]);
      setGuardando(false);
    }
  };

  if (cargando) {
    return <p className="text-center">Cargando...</p>;
  }

  return (
    <form onSubmit={guardar} className="admin-form">
      <h2 className="mb-3">{esNuevo ? 'Agregar comida' : 'Editar comida'}</h2>

      <div className="mb-3">
        <span className="form-label d-block">Foto</span>
        {producto.foto ? (
          <img src={producto.foto} alt="Vista previa" className="admin-form__foto mb-2" />
        ) : (
          <div className="admin-form__foto admin-form__foto--vacia mb-2">Sin foto</div>
        )}
        <label className={`boton boton--secundario boton--ancho ${procesandoFoto ? "boton--deshabilitado" : ""}`}>
          <i className="bi bi-camera"></i> {procesandoFoto ? 'Procesando foto...' : producto.foto ? 'Cambiar foto' : 'Elegir foto'}
          <input type="file" accept="image/*" hidden onChange={elegirFoto} disabled={procesandoFoto} />
        </label>
        {producto.foto.startsWith('data:') && (
          <small className="text-muted">Foto optimizada: {pesoEnKB(producto.foto)} KB</small>
        )}
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
        <button type="submit" className="boton boton--primario flex-grow-1" disabled={guardando || procesandoFoto}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
        <Link to="/admin" className="boton boton--secundario">Cancelar</Link>
      </div>
    </form>
  );
};

export default ProductoForm;
