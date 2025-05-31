const Servico = require('../modelos/Servico');
const { sendEmail } = require('../utils/notificacao');
const User = require('../modelos/User');
const Veiculo = require('../modelos/Veiculo');

// Utilitário para construir query de busca
const buildSearchQuery = (searchTerm) => {
    if (!searchTerm) return {};
    
    return {
        $or: [
            { type: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { observations: { $regex: searchTerm, $options: 'i' } }
        ]
    };
};

// Utilitário para construir query de filtros
const buildFilterQuery = (filters, userRole, userId) => {
    let query = {};
    
    // Se não for admin, mostrar apenas serviços do próprio usuário
    if (userRole !== 'admin') {
        query.userId = userId;
    } else if (filters.userId) {
        query.userId = filters.userId;
    }
    
    // Filtros adicionais
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = { $regex: filters.type, $options: 'i' };
    if (filters.veiculoId) query.veiculoId = filters.veiculoId;
    if (filters.dateFrom || filters.dateTo) {
        query.scheduledDate = {};
        if (filters.dateFrom) query.scheduledDate.$gte = new Date(filters.dateFrom);
        if (filters.dateTo) query.scheduledDate.$lte = new Date(filters.dateTo);
    }
    
    return query;
};

// Obter todos os serviços com paginação, ordenação e busca
exports.getServicos = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt',
            search,
            status,
            type,
            userId: filterUserId,
            veiculoId,
            dateFrom,
            dateTo
        } = req.query;

        // Construir queries
        const searchQuery = buildSearchQuery(search);
        const filterQuery = buildFilterQuery({
            status, type, userId: filterUserId, veiculoId, dateFrom, dateTo
        }, req.user.role, req.user.id);
        
        // Combinar queries
        const finalQuery = { ...filterQuery, ...searchQuery };
        
        // Configurar paginação
        const skip = (page - 1) * limit;
        const sortOptions = {};
        
        // Parse do sort
        if (sort.startsWith('-')) {
            sortOptions[sort.substring(1)] = -1;
        } else {
            sortOptions[sort] = 1;
        }
        
        // Executar query
        const [servicos, total] = await Promise.all([
            Servico.find(finalQuery)
                .populate('userId', 'name email')
                .populate('veiculoId', 'make model licensePlate')
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit)),
            Servico.countDocuments(finalQuery)
        ]);
        
        res.status(200).json({
            servicos,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: total,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Confirmar serviço (apenas admin)
exports.confirmarServico = async (req, res) => {
    try {
        const { id } = req.params;
        const { confirmed, adminNotes } = req.body;
        
        const servico = await Servico.findById(id)
            .populate('userId', 'name email')
            .populate('veiculoId', 'make model licensePlate');
        
        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        
        if (servico.status !== 'pending_confirmation') {
            return res.status(400).json({ message: 'Serviço já foi processado' });
        }
        
        const newStatus = confirmed ? 'confirmed' : 'cancelled';
        const updateData = {
            status: newStatus,
            confirmedBy: req.user.id,
            confirmedAt: new Date()
        };
        
        if (adminNotes) updateData.adminNotes = adminNotes;
        
        const updatedServico = await Servico.findByIdAndUpdate(id, updateData, { new: true });
        
        // Enviar notificação
        const statusText = confirmed ? 'confirmado' : 'cancelado';
        await sendEmail(
            servico.userId.email,
            `Serviço ${statusText}`,
            `Seu serviço de ${servico.type} para o veículo ${servico.veiculoId.make} ${servico.veiculoId.model} foi ${statusText}.${adminNotes ? ` Observações: ${adminNotes}` : ''}`
        );
        
        res.status(200).json(updatedServico);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Relatórios (apenas admin)
exports.getRelatorios = async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;
        
        let matchQuery = {};
        if (startDate && endDate) {
            matchQuery.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        if (type) matchQuery.type = type;
        
        const [
            servicosPorTipo,
            servicosPorStatus,
            receitaTotal,
            tempoMedio,
            totalServicos
        ] = await Promise.all([
            // Serviços por tipo
            Servico.aggregate([
                { $match: matchQuery },
                { $group: { _id: '$type', count: { $sum: 1 }, receita: { $sum: '$price' } } },
                { $sort: { count: -1 } }
            ]),
            
            // Serviços por status
            Servico.aggregate([
                { $match: matchQuery },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            
            // Receita total
            Servico.aggregate([
                { $match: { ...matchQuery, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$price' } } }
            ]),
            
            // Tempo médio (para serviços completados)
            Servico.aggregate([
                { 
                    $match: { 
                        ...matchQuery, 
                        status: 'completed',
                        completedDate: { $exists: true }
                    } 
                },
                {
                    $addFields: {
                        tempoExecucao: {
                            $divide: [
                                { $subtract: ['$completedDate', '$scheduledDate'] },
                                1000 * 60 * 60 * 24 // converter para dias
                            ]
                        }
                    }
                },
                { $group: { _id: null, tempoMedio: { $avg: '$tempoExecucao' } } }
            ]),
            
            // Total de serviços
            Servico.countDocuments(matchQuery)
        ]);
        
        res.status(200).json({
            servicosPorTipo,
            servicosPorStatus,
            receita: receitaTotal[0]?.total || 0,
            tempoMedioExecucao: tempoMedio[0]?.tempoMedio || 0,
            totalServicos
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Histórico de intervenções por veículo
exports.getHistoricoVeiculo = async (req, res) => {
    try {
        const { veiculoId } = req.params;
        
        // Verificar se o veículo existe e se o usuário tem permissão
        const veiculo = await Veiculo.findById(veiculoId);
        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }
        
        if (req.user.role !== 'admin' && veiculo.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Não autorizado' });
        }
        
        const historico = await Servico.find({ veiculoId })
            .populate('userId', 'name email')
            .populate('confirmedBy', 'name')
            .sort('-createdAt');
        
        res.status(200).json(historico);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
