const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderCustomSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    orderName: {
        type: String,
        required: true
    },
    referenceImage: {
        type: String, // Guardaremos la URL de la imagen en Cloudinary o similar
        required: false
    },
    dimensions: {
        width: { type: Number, required: true },
        height: { type: Number, required: true }
    },
    details: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    shippingAddress: {
        address: { type: String, required: true },
        phone: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'in_review', 'approved', 'in_production', 'completed', 'cancelled'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Actualizar la fecha de modificación antes de guardar
OrderCustomSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('OrderCustom', OrderCustomSchema);