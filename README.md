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
- Página "Nosotros" y página de error para rutas inexistentes.

## Tecnologías

- **React 18** con **Vite** y TypeScript configurado
- **React Router** para la navegación
- **Firebase / Firestore** como base de datos
- **React Bootstrap**, Bootstrap Icons y Font Awesome para la interfaz

## Cómo correrlo

```bash
npm install
npm run dev
```

La app usa un proyecto de Firebase con una colección `productos`. Para usar otro proyecto, cambiar la configuración en `src/assets/service/firebase.jsx`.
