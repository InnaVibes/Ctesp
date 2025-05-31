const express = require('express');
const { 
    addVeiculo, 
    getVeiculos, 
    getVeiculoById, 
    updateVeiculo, 
    deleteVeiculo 
} = require('../controladores/controladorVeiculo');
const { auth, admin } = require('../middlewares/autorizacao');
const router = express.Router();

// Rotas para veículos (todas requerem autenticação)
router.post('/', auth, addVeiculo);
router.get('/', auth, getVeiculos);
router.get('/:id', auth, getVeiculoById);
router.put('/:id', auth, updateVeiculo);
router.delete('/:id', auth, deleteVeiculo);

module.exports = router;