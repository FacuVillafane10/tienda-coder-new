import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../assets/service/firebase';
import { CATEGORIAS, nombreCategoria } from '../utils/categorias';
import { formatearPrecio, estaDisponible } from '../utils/formato';
import { configRef, obtenerWhatsApp } from '../utils/config';
import { normalizarProducto, problemasDelProducto, mensajeErrorFirestore } from './productos';

const ordenCategoria = (clave) => {
  const i = CATEGORIAS.findIndex((c) => c.clave === clave);
  return i === -1 ? CATEGORIAS.length : i;
};

// Acepta "+54 9 351 241-7327", "5493512417327", etc. y deja solo los dígitos
const limpiarNumero = (texto) => texto.replace(/\D/g, '');

const ConfigWhatsApp = () => {
  const [numero, setNumero] = useState('');
  const [estado, setEstado] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    obtenerWhatsApp().then(setNumero);
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    const limpio = limpiarNumero(numero);
    if (!/^549\d{10}$/.test(limpio)) {
      setEstado({
        tipo: 'danger',
        texto: 'Escribilo como 549 + código de área sin 0 + número sin 15. Ejemplo: 5493511234567.',
      });
      return;
    }
    try {
      await setDoc(configRef(), { whatsapp: limpio });
      setNumero(limpio);
      setEstado({ tipo: 'success', texto: 'Número guardado. Los pedidos llegan a este WhatsApp.' });
    } catch (err) {
      setEstado({ tipo: 'danger', texto: mensajeErrorFirestore(err) });
    }
  };

  return (
    <form onSubmit={guardar} className="card card-body shadow-sm mb-4">
      <label className="form-label fw-semibold" htmlFor="whatsapp">
        <i className="bi bi-whatsapp text-success"></i> WhatsApp para recibir pedidos
      </label>
      <div className="input-group">
        <input
          id="whatsapp"
          className="form-control"
          inputMode="tel"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="5493511234567"
        />
        <button className="btn btn-success" type="submit">Guardar</button>
      </div>
      {estado.texto && <div className={`alert alert-${estado.tipo} py-2 mt-2 mb-0`}>{estado.texto}</div>}
    </form>
  );
};

const Panel = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const snap = await getDocs(collection(db, 'productos'));
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      lista.sort((a, b) =>
        ordenCategoria(a.categoria) - ordenCategoria(b.categoria) ||
        (a.nombre || '').localeCompare(b.nombre || '', 'es'));
      setProductos(lista);
    } catch {
      setError('No se pudieron cargar los productos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const cambiarDisponible = async (producto) => {
    setError('');
    if (problemasDelProducto(producto).length > 0) {
      setError(`"${producto.nombre}" tiene datos incompletos: tocá Editar y completalos primero.`);
      return;
    }
    const actualizado = normalizarProducto({ ...producto, disponible: !estaDisponible(producto) });
    try {
      await setDoc(doc(db, 'productos', producto.id), actualizado);
      setProductos((lista) => lista.map((p) => (p.id === producto.id ? { id: p.id, ...actualizado } : p)));
    } catch (err) {
      setError(mensajeErrorFirestore(err));
    }
  };

  const borrar = async (producto) => {
    setError('');
    if (!window.confirm(`¿Borrar "${producto.nombre}"? No se puede deshacer.\n\nSi solo querés ocultarla un tiempo, usá el interruptor "Disponible".`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'productos', producto.id));
      setProductos((lista) => lista.filter((p) => p.id !== producto.id));
    } catch (err) {
      setError(mensajeErrorFirestore(err));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h2 className="mb-0">Mis comidas</h2>
        <Link to="/admin/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Agregar comida
        </Link>
      </div>

      <ConfigWhatsApp />

      {error && <div className="alert alert-danger">{error}</div>}
      {cargando && <p className="text-center">Cargando...</p>}

      <div className="admin-lista">
        {productos.map((p) => {
          const problemas = problemasDelProducto(p);
          const disponible = estaDisponible(p);
          return (
            <div key={p.id} className={`card shadow-sm admin-item ${disponible ? '' : 'admin-item--pausado'}`}>
              <img src={p.foto} alt={p.nombre} className="admin-item__foto" />
              <div className="admin-item__datos">
                <strong>{p.nombre || 'Sin nombre'}</strong>
                <span className="text-muted small">{nombreCategoria(p.categoria)}</span>
                <span>{problemas.includes('Falta el precio') ? '—' : formatearPrecio(p.precio)}</span>
                {problemas.map((texto) => (
                  <span key={texto} className="badge text-bg-warning align-self-start">{texto}</span>
                ))}
                {!disponible && <span className="badge text-bg-secondary align-self-start">Pausada</span>}
              </div>
              <div className="admin-item__acciones">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id={`disp-${p.id}`}
                    checked={disponible}
                    onChange={() => cambiarDisponible(p)}
                  />
                  <label className="form-check-label small" htmlFor={`disp-${p.id}`}>Disponible</label>
                </div>
                <Link to={`/admin/editar/${p.id}`} className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-pencil"></i> Editar
                </Link>
                <button className="btn btn-outline-danger btn-sm" onClick={() => borrar(p)}>
                  <i className="bi bi-trash"></i> Borrar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Panel;
