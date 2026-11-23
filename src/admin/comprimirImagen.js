// Achica una foto en el navegador para guardarla dentro de Firestore.
// Devuelve un data URL WebP (o JPEG si el navegador no soporta WebP).

const LADO_MAXIMO = 800;
const TAMANO_MAXIMO = 600 * 1024; // caracteres del data URL (~600 KB); Firestore admite hasta 1 MB por documento
const CALIDADES = [0.75, 0.6, 0.45, 0.3];

const cargarImagen = (archivo) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen. Probá con una foto JPG, PNG o WebP.'));
    };
    img.src = url;
  });

export const comprimirImagen = async (archivo) => {
  if (!archivo.type.startsWith('image/')) {
    throw new Error('El archivo elegido no es una imagen.');
  }

  const img = await cargarImagen(archivo);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // fondo blanco para PNG con transparencia
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const soportaWebp = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  const formato = soportaWebp ? 'image/webp' : 'image/jpeg';

  for (const calidad of CALIDADES) {
    const dataUrl = canvas.toDataURL(formato, calidad);
    if (dataUrl.length <= TAMANO_MAXIMO) {
      return dataUrl;
    }
  }

  throw new Error('La foto sigue siendo demasiado pesada. Probá con otra.');
};

export const pesoEnKB = (dataUrl) => Math.round((dataUrl.length * 3) / 4 / 1024);
