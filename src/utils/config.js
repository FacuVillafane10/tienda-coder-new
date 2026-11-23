import { doc, getDoc } from 'firebase/firestore';
import { db } from '../assets/service/firebase';

// Número que se usa si todavía no se cargó ninguno desde el panel
export const WHATSAPP_POR_DEFECTO = '5493512417327';

export const configRef = () => doc(db, 'config', 'tienda');

export const obtenerWhatsApp = async () => {
  try {
    const snap = await getDoc(configRef());
    const numero = snap.exists() ? snap.data().whatsapp : null;
    return numero || WHATSAPP_POR_DEFECTO;
  } catch {
    return WHATSAPP_POR_DEFECTO;
  }
};
