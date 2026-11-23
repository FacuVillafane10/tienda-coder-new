import { getAuth } from 'firebase/auth';
import { app } from '../assets/service/firebase';

// Solo lo usa el panel: así el login no se descarga para los clientes de la tienda
export const auth = getAuth(app);
