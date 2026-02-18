import React from 'react'
import {Link} from 'react-router-dom'
const Alerta = () => {
  return (
    <div className='d-flex flex-column align-items-center justify-content-center'>
        <h1 className='text-danger'> Aún no contamos con esa sección</h1>
        <Link className='btn btn-dark' to='/'>Volver al Inicio</Link>
    </div>
  )
}
export default Alerta     