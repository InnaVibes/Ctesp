const Favorito = require('../modelos/Favorito');
const CatalogoServico = require('../modelos/CatalogoServico');

// Adicionar aos favoritos
exports.adicionarFavorito = async (req, res) => {
    try {
        const { catalogoServicoId } = req.body;
        
        // Verificar se o serviço existe
        const servico = await CatalogoServico.findById(catalogoServicoId);
        if (!servico || !servico.isActive) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        
        // Verificar se já não está nos favoritos
        const favoritoExistente = await Favorito.findOne({
            userId: req.user.id,
            catalogoServicoId
        });
        
        if (favoritoExistente) {
            return res.status(400).json({ message: 'Serviço já está nos favoritos' });
        }
        
        const novoFavorito = new Favorito({
            userId: req.user.id,
            catalogoServicoId
        });
        
        await novoFavorito.save();
        res.status(201).json({ message: 'Adicionado aos favoritos' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remover dos favoritos
exports.removerFavorito = async (req, res) => {
    try {
        const { catalogoServicoId } = req.params;
        
        const favorito = await Favorito.findOneAndDelete({
            userId: req.user.id,
            catalogoServicoId
        });
        
        if (!favorito) {
            return res.status(404).json({ message: 'Favorito não encontrado' });
        }
        
        res.json({ message: 'Removido dos favoritos' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Listar favoritos do usuário
exports.listarFavoritos = async (req, res) => {
    try {
        const favoritos = await Favorito.find({ userId: req.user.id })
            .populate('catalogoServicoId')
            .sort({ createdAt: -1 });
        
        const servicosFavoritos = favoritos
            .filter(f => f.catalogoServicoId && f.catalogoServicoId.isActive)
            .map(f => ({
                ...f.catalogoServicoId.toObject(),
                isFavorito: true,
                dataFavorito: f.createdAt
            }));
        
        res.json(servicosFavoritos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};