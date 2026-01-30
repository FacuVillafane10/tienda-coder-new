// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Asegúrate de tener esto
import NavBar from './components/NavBar';
import ItemListContainer from './components/ItemListContainer';
import ItemDetail from './components/ItemDetail';
import CartIcon from './components/CartIcon'; // Importa el nuevo componente
import comidas from './comidas';  
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import CartWidget from './components/CartWidget';
import Error from './components/Error';

function App() {
  const message = "Bienvenidos a Paula Foods";

  return (
    <CartProvider>
      <BrowserRouter>
        <NavBar message={message} />
        <CartIcon /> {/* Ícono flotante del carrito */}
        <Routes>
          <Route 
            path='/' 
            element={<ItemListContainer message="Lista de productos disponibles" comidas={comidas} />} 
          />
          <Route 
            path='/product/:id' 
            element={<ItemDetail comidas={comidas} />}  
          />
          <Route path='/cart' element={<CartWidget />} /> 
          <Route path='*' element={<Error />} />
        </Routes>  
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;