const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    catalogoServicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogoServico', required: true },
    servicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Servico' }, // Opcional: avaliação baseada em serviço realizado
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    isApproved: { type: Boolean, default: false }, // Moderação de comentários
}, {
    timestamps: true
});

// Garantir que um usuário pode avaliar o mesmo serviço apenas uma vez
avaliacaoSchema.index({ userId: 1, catalogoServicoId: 1 }, { unique: true });

module.exports = mongoose.model('Avaliacao', avaliacaoSchema);