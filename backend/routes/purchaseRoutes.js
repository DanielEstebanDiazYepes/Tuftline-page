const express = require("express");
const router = express.Router();
const { sendPurchaseReceipt } = require("../utils/mailer");

router.post("/confirm", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const user = req.user;
  const { product, quantity, message } = req.body;
  const total = product.price * quantity;

  const html = `
    <h2>¡Gracias por tu compra, ${user.name}!</h2>
    <p>Tu compra fue realizada con éxito.</p>
    <hr/>
    <h3>Detalles de la compra:</h3>
    <ul>
      <li><strong>Producto:</strong> ${product.name}</li>
      <li><strong>Cantidad:</strong> ${quantity}</li>
      <li><strong>Precio unitario:</strong> $${product.price}</li>
      <li><strong>Total:</strong> $${total}</li>
    </ul>
    <h3>Datos de envío:</h3>
    <ul>
      <li><strong>Dirección:</strong> ${user.address}</li>
      <li><strong>Teléfono:</strong> ${user.phone}</li>
    </ul>
    ${message ? `<p><strong>Mensaje adicional:</strong> ${message}</p>` : ""}
    <hr/>
    <p>¡Te notificaremos cuando tu pedido esté en camino!</p>
  `;

  try {
    await sendPurchaseReceipt(user.email, "Factura de tu compra en Tienda Online", html);
    res.json({ success: true });
  } catch (err) {
    console.error("Error al enviar correo:", err);
    res.status(500).json({ error: "Error al enviar la factura" });
  }
});

module.exports = router;
