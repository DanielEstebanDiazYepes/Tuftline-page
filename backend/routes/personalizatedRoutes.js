const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/mailer');
const OrderCustom = require('../models/personalizedOrder');
const authMiddleware = require("../middlewares/authMiddleware")
const upload = require('../middlewares/uploadMiddlewares'); // Configuración para subir imágenes

// Middleware para verificar autenticación


// Crear un nuevo pedido personalizado
router.post('/create', authMiddleware, upload.single('referenceImage'), async (req, res) => {
    const user = req.user;
    const { 
        orderName, 
        width, 
        height, 
        details, 
        price,
        address,
        phone
    } = req.body;

    try {
        // Procesar la imagen si se subió
        let imageUrl = '';
        if (req.file) {
            // Aquí subirías la imagen a Cloudinary o tu servicio de almacenamiento
            // imageUrl = await cloudinary.uploader.upload(req.file.path);
            imageUrl = `/uploads/${req.file.filename}`; // Ejemplo simple con multer
        }

        // Crear el pedido en la base de datos
        const newCustomOrder = new OrderCustom({
            user: user._id,
            userName: user.name,
            userEmail: user.email,
            orderName,
            referenceImage: imageUrl,
            dimensions: {
                width: parseFloat(width),
                height: parseFloat(height)
            },
            details,
            price: parseFloat(price),
            shippingAddress: {
                address: address || user.address,
                phone: phone || user.phone
            }
        });

        await newCustomOrder.save();

        // Enviar email de confirmación
        const html = `
            <h2>¡Gracias por tu pedido personalizado, ${user.name}!</h2>
            <p>Hemos recibido tu solicitud de "${orderName}" y la estamos revisando.</p>
            <hr/>
            <h3>Detalles del pedido:</h3>
            <ul>
                <li><strong>Nombre del pedido:</strong> ${orderName}</li>
                <li><strong>Medidas:</strong> ${width}cm (ancho) x ${height}cm (alto)</li>
                <li><strong>Precio acordado:</strong> $${price}</li>
            </ul>
            ${imageUrl ? `<p><strong>Imagen de referencia:</strong> <img src="${imageUrl}" alt="Referencia" style="max-width: 200px;"></p>` : ''}
            <h3>Datos de envío:</h3>
            <ul>
                <li><strong>Dirección:</strong> ${address || user.address}</li>
                <li><strong>Teléfono:</strong> ${phone || user.phone}</li>
            </ul>
            ${details ? `<p><strong>Detalles adicionales:</strong> ${details}</p>` : ""}
            <hr/>
            <p>Nos comunicaremos contigo en un plazo de 24-48 horas para confirmar los detalles.</p>
        `;

        await sendEmail(user.email, "Confirmación de pedido personalizado", html);

        res.json({ 
            success: true, 
            orderId: newCustomOrder._id,
            message: "Pedido personalizado creado con éxito"
        });

    } catch (err) {
        console.error("Error al procesar el pedido personalizado:", err);
        res.status(500).json({ error: "Error al procesar el pedido personalizado" });
    }
});

// Obtener todos los pedidos personalizados de un usuario
router.get('/user-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await OrderCustom.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (err) {
        console.error("Error al obtener pedidos:", err);
        res.status(500).json({ error: "Error al obtener pedidos" });
    }
});

// Obtener detalles de un pedido específico
router.get('/:orderId', authMiddleware, async (req, res) => {
    try {
        const order = await OrderCustom.findOne({
            _id: req.params.orderId,
            user: req.user._id
        });
        
        if (!order) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }
        
        res.json(order);
    } catch (err) {
        console.error("Error al obtener pedido:", err);
        res.status(500).json({ error: "Error al obtener pedido" });
    }
});

module.exports = router;