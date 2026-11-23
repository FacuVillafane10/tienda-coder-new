import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import NavBar from './components/NavBar';
import Inicio from './components/Inicio';
import ItemListContainer from './components/ItemListContainer';
import ItemDetail from './components/ItemDetail';
import CartWidget from './components/CartWidget';
import Nosotros from './components/Nosotros';
import Error from './components/Error';
import Pie from './components/Pie';
import BarraPedido from './components/BarraPedido';
import Desplazamiento from './components/Desplazamiento';

// El panel se descarga solo al entrar a /admin, así la tienda carga más rápido
const RutaAdmin = lazy(() => import('./admin/RutaAdmin'));
const Panel = lazy(() => import('./admin/Panel'));
const ProductoForm = lazy(() => import('./admin/ProductoForm'));
const cargandoPanel = <div className="contenedor seccion" style={{ textAlign: 'center' }}>Cargando...</div>;

function Contenido() {
  const { pathname } = useLocation();
  const enPanel = pathname.startsWith('/admin');

  return (
    <>
      <Desplazamiento />
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/categorias/:categoria" element={<ItemListContainer />} />
          <Route path="/product/:id" element={<ItemDetail />} />
          <Route path="/cart" element={<CartWidget />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/admin" element={<Suspense fallback={cargandoPanel}><RutaAdmin /></Suspense>}>
            <Route index element={<Panel />} />
            <Route path="nuevo" element={<ProductoForm />} />
            <Route path="editar/:id" element={<ProductoForm />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </main>
      {!enPanel && <Pie />}
      <BarraPedido />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Contenido />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
