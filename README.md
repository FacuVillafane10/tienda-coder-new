# Paula Foods · Tienda online de comida casera

Tienda online para un emprendimiento de comida casera: catálogo por categorías, detalle de cada producto, carrito de compras y envío del pedido por WhatsApp.

**Ver sitio:** https://paulafoods.netlify.app/

Proyecto final del curso de React de Coderhouse.

## Funcionalidades

- **Catálogo desde Firebase**: los productos se leen de Firestore.
- **Categorías** (comida rápida, saludables, menú diario) con filtro por URL (`/categorias/:categoria`).
- **Detalle de producto** (`/product/:id`) con selección de cantidad.
- **Carrito** global con React Context: agregar y quitar productos, cambiar cantidades, vaciarlo y ver el total.
- **Pedido por WhatsApp**: arma un mensaje con cada producto, cantidad, subtotal y el total, y abre WhatsApp listo para enviarlo.
- **Panel de administración** (`/admin`) con login: la dueña edita sus comidas sin tocar código.
- Página "Nosotros" y página de error para rutas inexistentes.

## Panel de administración

En `/admin`, con email y contraseña, se puede:

- Editar nombre, precio, descripción, categoría y foto de cada comida.
- Agregar comidas nuevas y borrar las que ya no se hacen.
- Pausar una comida con el interruptor **Disponible**: deja de verse en la tienda sin perderla.
- Cambiar el número de WhatsApp que recibe los pedidos.

Las fotos se achican en el navegador (800 px, WebP, ~100 KB) y se guardan dentro del mismo documento de Firestore, sin necesidad de Firebase Storage.

### Seguridad

La protección no depende de esconder la página. La dan **Firebase Authentication** y las reglas de [`firestore.rules`](firestore.rules): cualquiera puede leer el catálogo, pero solo la cuenta administradora (identificada por su UID) puede crear, modificar o borrar. Las reglas también validan los datos (precio numérico, categoría válida, tamaño de la foto) y cierran cualquier otra colección.

### Configuración (una sola vez, en la consola de Firebase)

1. **Authentication** → Método de acceso → habilitar **Correo electrónico/contraseña**.
2. **Authentication** → Usuarios → **Agregar usuario** con el email de la administradora. Copiar su **UID**.
3. Reemplazar `UID_DE_LA_ADMINISTRADORA` en `firestore.rules` por ese UID.
4. **Firestore Database** → **Reglas**: pegar el contenido de `firestore.rules` y **Publicar**.

## Tecnologías

- **React 18** con **Vite** y TypeScript configurado
- **React Router** para la navegación
- **Firebase**: Firestore como base de datos y Authentication para el panel
- **React Bootstrap**, Bootstrap Icons y Font Awesome para la interfaz

## Cómo correrlo

```bash
npm install
npm run dev
```

La app usa un proyecto de Firebase con las colecciones `productos` y `config` (documento `tienda`, con el WhatsApp). Para usar otro proyecto, cambiar la configuración en `src/assets/service/firebase.jsx`.
