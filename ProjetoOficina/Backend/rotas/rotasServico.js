const express = require('express');
const { 
    addServico, 
    getServicos, 
    getServicoById,
    updateServico, 
    deleteServico,
    confirmarServico,
    getRelatorios,
    getHistoricoVeiculo
} = require('../controladores/controladorServico');
const { auth, admin } = require('../middlewares/autorizacao');
const router = express.Router();

// Rotas para serviços
router.post('/', auth, addServico); // Cliente pode criar, admin confirma depois
router.get('/', auth, getServicos); // Com paginação, sort e search
router.get('/relatorios', auth, admin, getRelatorios); // Relatórios admin
router.get('/historico/:veiculoId', auth, getHistoricoVeiculo); // Histórico por veículo
router.get('/:id', auth, getServicoById);
router.put('/:id', auth, admin, updateServico);
router.put('/:id/confirmar', auth, admin, confirmarServico); // Nova rota para confirmação
router.delete('/:id', auth, admin, deleteServico);

module.exports = router;