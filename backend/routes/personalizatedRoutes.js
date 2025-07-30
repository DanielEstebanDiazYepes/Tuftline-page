const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/mailer');
const OrderCustom = require('../models/personalizedOrder');
const authMiddleware = require("../middlewares/authMiddleware")
const upload = require('../middlewares/uploadMiddlewares'); // Configuración para subir imágenes


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

// OBTENER TODAS LAS ORDENES 
router.get('/', async (req, res) => {
    try {
        const orders = await OrderCustom.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name email');
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener órdenes personalizadas' });
    }
});

// Obtener una orden personalizada específica
router.get('/:id', async (req, res) => {
    try {
        const order = await OrderCustom.findById(req.params.id)
            .populate('user', 'name email');
        
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener la orden' });
    }
});

// Actualizar estado de orden personalizada
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await OrderCustom.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la orden' });
    }
});

// Eliminar orden personalizada
router.delete('/:id', async (req, res) => {
    try {
        const order = await OrderCustom.findByIdAndDelete(req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar la orden' });
    }
});

module.exports = router;