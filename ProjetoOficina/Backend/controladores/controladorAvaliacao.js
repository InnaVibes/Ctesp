const Avaliacao = require('../modelos/Avaliacao');
const CatalogoServico = require('../modelos/CatalogoServico');
const User = require('../modelos/User');
const { sendEmail } = require('../utils/notificacao');

// Criar avaliação
exports.criarAvaliacao = async (req, res) => {
    try {
        const { catalogoServicoId, rating, comment, servicoId } = req.body;
        
        // Verificar se o serviço existe
        const servico = await CatalogoServico.findById(catalogoServicoId);
        if (!servico || !servico.isActive) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        
        // Verificar se o usuário já avaliou este serviço
        const avaliacaoExistente = await Avaliacao.findOne({
            userId: req.user.id,
            catalogoServicoId
        });
        
        if (avaliacaoExistente) {
            return res.status(400).json({ message: 'Você já avaliou este serviço' });
        }
        
        const novaAvaliacao = new Avaliacao({
            userId: req.user.id,
            catalogoServicoId,
            rating,
            comment,
            servicoId
        });
        
        await novaAvaliacao.save();
        await novaAvaliacao.populate('userId', 'name');
        
        res.status(201).json(novaAvaliacao);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar avaliação
exports.atualizarAvaliacao = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        
        const avaliacao = await Avaliacao.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!avaliacao) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
        
        avaliacao.rating = rating;
        avaliacao.comment = comment;
        avaliacao.isApproved = false; // Requer nova aprovação se foi editada
        
        await avaliacao.save();
        await avaliacao.populate('userId', 'name');
        
        res.json(avaliacao);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deletar avaliação
exports.deletarAvaliacao = async (req, res) => {
    try {
        const avaliacao = await Avaliacao.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!avaliacao) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
        
        res.json({ message: 'Avaliação removida' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Listar avaliações do usuário
exports.minhasAvaliacoes = async (req, res) => {
    try {
        const avaliacoes = await Avaliacao.find({ userId: req.user.id })
            .populate('catalogoServicoId', 'name image')
            .sort({ createdAt: -1 });
        
        res.json(avaliacoes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Aprovar avaliação
exports.aprovarAvaliacao = async (req, res) => {
    try {
        const avaliacao = await Avaliacao.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).populate('userId', 'name').populate('catalogoServicoId', 'name');
        
        if (!avaliacao) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
        
        res.json(avaliacao);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Listar avaliações pendentes
exports.avaliacoesPendentes = async (req, res) => {
    try {
        const avaliacoes = await Avaliacao.find({ isApproved: false })
            .populate('userId', 'name email')
            .populate('catalogoServicoId', 'name')
            .sort({ createdAt: -1 });
        
        res.json(avaliacoes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};