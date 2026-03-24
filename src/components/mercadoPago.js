// backend/payment.js (Ejemplo)
const mercadopago = require('mercadopago');

// Configura el acceso a Mercado Pago con tu Access Token
mercadopago.configurations.setAccessToken('TU_ACCESS_TOKEN');

// Crear preferencia
const createPreference = async (req, res) => {
  const { items } = req.body; // Los productos que el usuario quiere comprar

  const preference = {
    items: items.map(item => ({
      title: item.nombre,
      quantity: item.quantity,
      unit_price: item.precio,
    })),
    back_urls: {
      success: 'http://localhost:3000/success', // Redirige al éxito
      failure: 'http://localhost:3000/failure', // Redirige al fracaso
      pending: 'http://localhost:3000/pending', // Redirige al estado pendiente
    },
    auto_return: 'approved', // Auto retorno cuando el pago es aprobado
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id }); // Devuelve el ID de la preferencia
  } catch (error) {
    res.status(500).send({ error: 'Error creando la preferencia de pago.' });
  }
};

module.exports = { createPreference };