const Veiculo = require('../modelos/Veiculo');

// Adicionar um novo veículo
exports.addVeiculo = async (req, res) => {
    try {
        const newVeiculo = new Veiculo({
            ...req.body,
            userId: req.user.id
        });
        
        await newVeiculo.save();
        res.status(201).json(newVeiculo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter todos os veículos do usuário
exports.getVeiculos = async (req, res) => {
    try {
        let query = {};
        
        // Se não for admin, mostrar apenas veículos do próprio usuário
        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        } else if (req.query.userId) {
            // Se for admin e fornecer userId na query, filtrar por esse usuário
            query.userId = req.query.userId;
        }
        
        const veiculos = await Veiculo.find(query).populate('userId', 'name email');
        res.status(200).json(veiculos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter um veículo específico
exports.getVeiculoById = async (req, res) => {
    try {
        const veiculo = await Veiculo.findById(req.params.id).populate('userId', 'name email');
        
        if (!veiculo) {
            return res.status(404).json({ message: 'Veiculo not found' });
        }
        
        // Verificar se o usuário tem permissão para ver o veículo
        if (req.user.role !== 'admin' && veiculo.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this veiculo' });
        }
        
        res.status(200).json(veiculo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar um veículo
exports.updateVeiculo = async (req, res) => {
    try {
        const veiculo = await Veiculo.findById(req.params.id);
        
        if (!veiculo) {
            return res.status(404).json({ message: 'Veiculo not found' });
        }
        
        // Verificar se o usuário tem permissão para atualizar o veículo
        if (req.user.role !== 'admin' && veiculo.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this veiculo' });
        }
        
        const updatedVeiculo = await Veiculo.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        
        res.status(200).json(updatedVeiculo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deletar um veículo
exports.deleteVeiculo = async (req, res) => {
    try {
        const veiculo = await Veiculo.findById(req.params.id);
        
        if (!veiculo) {
            return res.status(404).json({ message: 'Veiculo not found' });
        }
        
        // Verificar se o usuário tem permissão para deletar o veículo
        if (req.user.role !== 'admin' && veiculo.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this veiculo' });
        }
        
        await Veiculo.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Veiculo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};