const express = require('express');
const {
    criarAvaliacao,
    atualizarAvaliacao,
    deletarAvaliacao,
    minhasAvaliacoes,
    aprovarAvaliacao,
    avaliacoesPendentes
} = require('../controladores/controladorAvaliacoes');
const { auth, admin } = require('../middlewares/autorizacao');
const router = express.Router();

// Rotas do usuário (requerem autenticação)
router.post('/', auth, criarAvaliacao);
router.put('/:id', auth, atualizarAvaliacao);
router.delete('/:id', auth, deletarAvaliacao);
router.get('/minhas', auth, minhasAvaliacoes);

// Rotas administrativas
router.put('/admin/:id/aprovar', auth, admin, aprovarAvaliacao);
router.get('/admin/pendentes', auth, admin, avaliacoesPendentes);

module.exports = router;