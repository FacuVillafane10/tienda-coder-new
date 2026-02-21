import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import NavBar from './components/NavBar';
import ItemListContainer from './components/ItemListContainer';
import ItemDetail from './components/ItemDetail';
import CartIcon from './components/CartIcon'; 
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import CartWidget from './components/CartWidget';
import Error from './components/Error';
import Nosotros from './components/Nosotros';

function App() {
  const message = "";

  return (
    <CartProvider>
      <BrowserRouter>
        <NavBar message={message} />
        <CartIcon /> 
        <Routes>
          <Route 
            path='/' 
            element={<ItemListContainer message="Nuestros productos" />} 
          />
          <Route 
            path='/product/:id' 
            element={<ItemDetail />}  
          />
          <Route 
            path='/categorias/:categoria'  // Ruta para filtrar productos por categoría
            element={<ItemListContainer message="Productos por categoría" />} 
          />
          <Route path='/cart' element={<CartWidget />} />
          <Route path='/nosotros' element={<Nosotros />} /> 
          <Route path='*' element={<Error />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;