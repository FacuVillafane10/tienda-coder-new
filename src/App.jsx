import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import NavBar from './components/NavBar';
import ItemListContainer from './components/ItemListContainer';
import ItemDetail from './components/ItemDetail';
import CartIcon from './components/CartIcon';  // Asegúrate de qué componente usar
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import CartWidget from './components/CartWidget';  // Elimina esto si no lo usas
import Error from './components/Error';
import Nosotros from './components/Nosotros';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <NavBar />  {/* Elimina el mensaje ya que no se usa */}
        <CartIcon /> {/* Esto podría ser un ícono fijo en la barra de navegación */}
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
            path='/categorias/:categoria'  
            element={<ItemListContainer  message="Productos por categoría" />} 
          />
          <Route path='/cart' element={<CartWidget />} /> {/* Asegúrate de que este sea el componente correcto */}
          <Route path='/nosotros' element={<Nosotros />} /> 
          <Route path='*' element={<Error />} /> {/* Página de error personalizada */}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;