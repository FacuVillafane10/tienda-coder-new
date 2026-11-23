import { CATEGORIAS } from '../utils/categorias';
import { tienePrecio } from '../utils/formato';

// Deja el producto con exactamente los campos que aceptan las reglas de Firestore.
// Al guardar así se eliminan campos viejos o mal escritos (por ejemplo "Precio" o "stock").
export const normalizarProducto = (p) => ({
  nombre: (p.nombre || '').trim(),
  descripcion: (p.descripcion || '').trim(),
  precio: Number(p.precio),
  categoria: p.categoria,
  foto: p.foto || '',
  disponible: p.disponible !== false,
});

// Devuelve los problemas de un producto (lista vacía si está bien)
export const problemasDelProducto = (p) => {
  const problemas = [];
  if (!(p.nombre || '').trim()) problemas.push('Falta el nombre');
  if (!tienePrecio({ precio: Number(p.precio) })) problemas.push('Falta el precio');
  if (!CATEGORIAS.some((c) => c.clave === p.categoria)) problemas.push('Falta la categoría');
  if (!p.foto) problemas.push('Falta la foto');
  if ((p.nombre || '').trim().length > 80) problemas.push('El nombre es muy largo (máximo 80 letras)');
  if ((p.descripcion || '').trim().length > 600) problemas.push('La descripción es muy larga (máximo 600 letras)');
  return problemas;
};

export const mensajeErrorFirestore = (err) =>
  err?.code === 'permission-denied'
    ? 'No tenés permiso para guardar cambios. Cerrá sesión y volvé a entrar con la cuenta de la tienda.'
    : 'No se pudo guardar. Revisá la conexión y volvé a intentar.';
