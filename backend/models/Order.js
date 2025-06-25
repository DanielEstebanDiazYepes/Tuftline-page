const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: { type: String, required: true }, // Nombre del usuario en el momento de la compra
    userEmail: { type: String, required: true }, // Email del usuario
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        imageUrl: { type: String }
    }],
    total: {
        type: Number,
        required: true
    },
    shippingAddress: {
        address: { type: String, required: true },
        phone: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    },
    message: { type: String } // Mensaje adicional del cliente
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);