import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../assets/service/firebase';

// Cada comida guarda su galería en productos/{id}/fotos: un documento por foto.
// La portada se copia además en el campo "foto" de la comida, así el menú
// descarga solo una imagen por comida y la galería se carga al abrir el detalle.
export const MAX_FOTOS = 6;

export const fotosRef = (productoId) => collection(db, 'productos', productoId, 'fotos');

export const obtenerFotos = async (productoId) => {
  const snap = await getDocs(query(fotosRef(productoId), orderBy('orden')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Lista de imágenes para mostrar: la portada primero y después el resto, sin repetir
export const imagenesParaMostrar = (portada, galeria) => {
  const lista = portada ? [portada] : [];
  galeria.forEach(({ imagen }) => {
    if (imagen && !lista.includes(imagen)) lista.push(imagen);
  });
  return lista;
};
