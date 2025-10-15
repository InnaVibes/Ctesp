const CatalogoServico = require('../modelos/CatalogoServico');
const Favorito = require('../modelos/Favorito');
const Avaliacao = require('../modelos/Avaliacao');

// Listar serviços do catálogo com paginação, ordenação e busca
exports.getCatalogo = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        
        // Filtros de busca
        let query = { isActive: true };
        
        // Busca por texto
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }
        
        // Filtro por categoria
        if (req.query.category && req.query.category !== 'all') {
            query.category = req.query.category;
        }
        
        // Filtro por tags
        if (req.query.tags) {
            const tags = req.query.tags.split(',');
            query.tags = { $in: tags };
        }
        
        // Filtro por preço
        if (req.query.minPrice || req.query.maxPrice) {
            query.basePrice = {};
            if (req.query.minPrice) query.basePrice.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) query.basePrice.$lte = parseFloat(req.query.maxPrice);
        }
        
        // Ordenação
        let sortOptions = {};
        switch (req.query.sort) {
            case 'price_asc':
                sortOptions = { basePrice: 1 };
                break;
            case 'price_desc':
                sortOptions = { basePrice: -1 };
                break;
            case 'name_asc':
                sortOptions = { name: 1 };
                break;
            case 'name_desc':
                sortOptions = { name: -1 };
                break;
            case 'newest':
                sortOptions = { createdAt: -1 };
                break;
            default:
                sortOptions = { name: 1 };
        }
        
        const servicos = await CatalogoServico.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
        
        const total = await CatalogoServico.countDocuments(query);
        
        // Se usuário está logado, verificar favoritos
        let servicosComFavoritos = servicos;
        if (req.user) {
            const favoritos = await Favorito.find({ userId: req.user.id });
            const favoritosIds = favoritos.map(f => f.catalogoServicoId.toString());
            
            servicosComFavoritos = servicos.map(servico => ({
                ...servico.toObject(),
                isFavorito: favoritosIds.includes(servico._id.toString())
            }));
        }
        
        res.json({
            servicos: servicosComFavoritos,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter detalhes de um serviço específico
exports.getServicoDetalhes = async (req, res) => {
    try {
        const servico = await CatalogoServico.findById(req.params.id);
        
        if (!servico?.isActive) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        
        // Buscar avaliações aprovadas
        const avaliacoes = await Avaliacao.find({ 
            catalogoServicoId: req.params.id, 
            isApproved: true 
        }).populate('userId', 'name').sort({ createdAt: -1 });
        
        // Calcular média das avaliações
        const mediaAvaliacoes = avaliacoes.length > 0 
            ? avaliacoes.reduce((acc, av) => acc + av.rating, 0) / avaliacoes.length 
            : 0;
        
        // Verificar se é favorito (se usuário logado)
        let isFavorito = false;
        if (req.user) {
            const favorito = await Favorito.findOne({ 
                userId: req.user.id, 
                catalogoServicoId: req.params.id 
            });
            isFavorito = !!favorito;
        }
        
        res.json({
            ...servico.toObject(),
            avaliacoes,
            mediaAvaliacoes: Math.round(mediaAvaliacoes * 10) / 10,
            totalAvaliacoes: avaliacoes.length,
            isFavorito
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter categorias disponíveis
exports.getCategorias = async (req, res) => {
    try {
        const categorias = await CatalogoServico.distinct('category', { isActive: true });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter tags populares
exports.getTags = async (req, res) => {
    try {
        const pipeline = [
            { $match: { isActive: true } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ];
        
        const tags = await CatalogoServico.aggregate(pipeline);
        res.json(tags.map(tag => ({ name: tag._id, count: tag.count })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Criar novo serviço no catálogo
exports.criarServicoAdmin = async (req, res) => {
    try {
        const novoServico = new CatalogoServico(req.body);
        await novoServico.save();
        res.status(201).json(novoServico);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Atualizar serviço do catálogo
exports.atualizarServicoAdmin = async (req, res) => {
    try {
        const servico = await CatalogoServico.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        
        res.json(servico);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Deletar serviço (desativar)
exports.deletarServicoAdmin = async (req, res) => {
    try {
        const servico = await CatalogoServico.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        
        res.json({ message: 'Serviço removido do catálogo' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Listar todos os serviços (incluindo inativos)
exports.listarTodosServicosAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        let query = {};
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }
        
        const servicos = await CatalogoServico.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await CatalogoServico.countDocuments(query);
        
        res.json({
            servicos,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};