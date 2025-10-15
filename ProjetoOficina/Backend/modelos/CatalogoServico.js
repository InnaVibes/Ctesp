const mongoose = require('mongoose');

const catalogoServicoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    basePrice: { type: Number, required: true },
    estimatedDuration: { type: String, required: true }, // Ex: "2 horas"
    tags: [{ type: String }],
    image: { type: String }, // URL da imagem
    isActive: { type: Boolean, default: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    requiredParts: [{ type: String }],
    warranty: { type: String }, // Ex: "30 dias"
}, {
    timestamps: true
});

// Índices para melhor performance na busca
catalogoServicoSchema.index({ name: 'text', description: 'text', tags: 'text' });
catalogoServicoSchema.index({ category: 1 });
catalogoServicoSchema.index({ basePrice: 1 });

module.exports = mongoose.model('CatalogoServico', catalogoServicoSchema);