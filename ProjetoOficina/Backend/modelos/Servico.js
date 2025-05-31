const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
    type: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    estimatedTime: { type: String },
    status: { 
        type: String, 
        enum: ['pending_confirmation', 'confirmed', 'in_progress', 'completed', 'cancelled'], 
        default: 'pending_confirmation' 
    },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },
    observations: { type: String },
    adminNotes: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    veiculoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Veiculo', required: true },
    images: [{ type: String }], // URLs das imagens
    confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    confirmedAt: { type: Date }
}, {
    timestamps: true
});

// Índices para performance
servicoSchema.index({ userId: 1, status: 1 });
servicoSchema.index({ type: 1 });
servicoSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('Servico', servicoSchema);