// Única lista de categorías de la tienda. Si se agrega una, también hay que
// sumarla en firestore.rules (productoValido).
export const CATEGORIAS = [
  { clave: 'comidarapida', nombre: 'Comidas Rápidas', emoji: '🍔' },
  { clave: 'saludables', nombre: 'Saludables', emoji: '🥗' },
  { clave: 'menudiario', nombre: 'Menú Diario', emoji: '🍽️' },
];

export const nombreCategoria = (clave) =>
  CATEGORIAS.find((c) => c.clave === clave)?.nombre ?? 'Sin categoría';
