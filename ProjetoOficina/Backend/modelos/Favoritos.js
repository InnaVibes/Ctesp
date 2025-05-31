const mongoose = require('mongoose');

const favoritoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    catalogoServicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogoServico', required: true },
}, {
    timestamps: true
});

// Garantir que um usuário não pode adicionar o mesmo serviço aos favoritos mais de uma vez
favoritoSchema.index({ userId: 1, catalogoServicoId: 1 }, { unique: true });

module.exports = mongoose.model('Favorito', favoritoSchema);