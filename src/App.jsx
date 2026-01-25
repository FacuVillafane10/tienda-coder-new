import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import ItemListContainer from './components/ItemListContainer';
import CartWidget from './components/CartWidget'; 
import comidas from './comidas';  
import './App.css';
import {BrowserRouter,Routes, Route} from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);  
  const message = "Bienvenidos a Paula Foods";

  const handleAddToCart = () => {
    setCount(count + 1); 
  };

  return (
    <BrowserRouter>
      <NavBar count={count} message={message} />
      <CartWidget count={count} message={message} />     
      <Routes>
        <Route path='/' element={<ItemListContainer message="Lista de productos disponibles" comidas={comidas} handleAddToCart={handleAddToCart} />} />
            <Route path='*' element={<Error/>}/>     
      </Routes>  
      
    </BrowserRouter>
  );
}

export default App;
