import { use } from 'react';
import {createContext, useState} from 'react';


//crear contexto
export const CartContext = createContext()


//crear proveedor
export const CartProvider = ({children}) =>{
    const {cart,setCart} = useState([])

    //Funciones (herramientas )




    //se crean todas las funciones que se quieran compartir 



    //y dentro de Value se pasan los nomobre de las funciones que se quieran usar en otros componentes
        return(
            <CartContext.Provider value={{cart}}>
                {children}
            </CartContext.Provider>
        )
}