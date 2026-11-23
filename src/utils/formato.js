export const formatearPrecio = (valor) => `$${(Number(valor) || 0).toLocaleString('es-AR')}`;

// Un producto tiene precio válido si es un número mayor a cero
export const tienePrecio = (producto) => typeof producto.precio === 'number' && producto.precio > 0;

// Los productos viejos no tienen el campo: cuentan como disponibles
export const estaDisponible = (producto) => producto.disponible !== false;
