const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/mailer");
const Order = require("../models/Order");

router.post("/confirm", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "No autenticado" });
    }

    const user = req.user;
    const { product, quantity, message } = req.body;
    const total = product.price * quantity;

    try {
        const newOrder = new Order({
            user: user._id,
            userName: user.name,
            userEmail: user.email,
            products: [{
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                imageUrl: product.imageUrl
            }],
            total: total,
            shippingAddress: {
                address: user.address,
                phone: user.phone
            },
            message: message
        });

        await newOrder.save();

        // Enviar email de confirmación
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

        await sendEmail(user.email, "Factura de tu compra en Tienda Online", html);
        res.json({ success: true, orderId: newOrder._id });

    } catch (err) {
        console.error("Error al procesar la compra:", err);
        res.status(500).json({ error: "Error al procesar la compra" });
    }
});

router.post("/cart", async (req, res) => {
    try {
        const user = req.user;
        const { cart, message } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: "Carrito vacío" });
        }

        let total = 0;
        const products = cart.map(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            
            return {
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.imageUrl
            };
        });

        // Crear la orden en la base de datos
        const newOrder = new Order({
            user: user._id,
            userName: user.name,
            userEmail: user.email,
            products: products,
            total: total,
            shippingAddress: {
                address: user.address,
                phone: user.phone
            },
            message: message
        });

        await newOrder.save();

        // Generar HTML para el email
        const productListHTML = products.map(item => {
            return `
                <li>
                    <strong>${item.name}</strong><br/>
                    Precio unitario: $${item.price} <br/>
                    Cantidad: ${item.quantity} <br/>
                    Subtotal: $${(item.price * item.quantity).toFixed(2)}
                </li>
                <hr/>
            `;
        }).join("");

        const html = `
            <h2>¡Gracias por tu compra, ${user.name}!</h2>
            <p>Tu pedido fue procesado exitosamente. Aquí están los detalles:</p>
            <h3>Productos:</h3>
            <ul>
                ${productListHTML}
            </ul>
            <h3>Total de la compra: $${total.toFixed(2)}</h3>
            <h3>Datos de envío:</h3>
            <ul>
                <li><strong>Dirección:</strong> ${user.address}</li>
                <li><strong>Teléfono:</strong> ${user.phone}</li>
            </ul>
            ${message ? `<p><strong>Mensaje adicional:</strong> ${message}</p>` : ""}
            <hr/>
            <p>Nos comunicaremos contigo cuando tu pedido esté en camino.</p>
        `;

        await sendEmail(user.email, "Factura de tu compra en Tienda Online", html);
        res.json({ success: true, orderId: newOrder._id });

    } catch (err) {
        console.error("Error al procesar la compra del carrito:", err);
        res.status(500).json({ error: "Error del servidor al procesar la compra" });
    }
});

module.exports = router;