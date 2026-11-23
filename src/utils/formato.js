export const formatearPrecio = (valor) => `$${(Number(valor) || 0).toLocaleString('es-AR')}`;

// Un producto tiene precio válido si es un número mayor a cero
export const tienePrecio = (producto) => typeof producto.precio === 'number' && producto.precio > 0;

// Los productos viejos no tienen el campo: cuentan como disponibles
export const estaDisponible = (producto) => producto.disponible !== false;

// Muchas descripciones tienen el precio escrito a mano ("Precio: $8,000.00").
// Como el precio ya se muestra aparte, se oculta de la descripción para que no quede desactualizado.
export const limpiarDescripcion = (texto = '') =>
  texto
    .replace(/\s*precio\s*:?\s*\$\s*[\d.,]+/gi, '')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
