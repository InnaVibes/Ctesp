const express = require('express');
const {
    getCatalogo,
    getServicoDetalhes,
    getCategorias,
    getTags,
    criarServicoAdmin,
    atualizarServicoAdmin,
    deletarServicoAdmin,
    listarTodosServicosAdmin
} = require('../controladores/controladorCatalogo');
const { auth, admin } = require('../middlewares/autorizacao');
const router = express.Router();

// Rotas públicas
router.get('/', getCatalogo); // Listagem do catálogo (com auth opcional)
router.get('/categorias', getCategorias);
router.get('/tags', getTags);
router.get('/:id', getServicoDetalhes); // Detalhes do serviço (com auth opcional)

// Middleware para verificar se usuário está logado (mas não obrigatório)
const optionalAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
        } catch (error) {
            // Token inválido, mas continua sem autenticação
        }
    }
    next();
};

// Aplicar autenticação opcional nas rotas que podem se beneficiar
router.get('/', optionalAuth, getCatalogo);
router.get('/:id', optionalAuth, getServicoDetalhes);

// Rotas administrativas
router.post('/admin', auth, admin, criarServicoAdmin);
router.get('/admin/todos', auth, admin, listarTodosServicosAdmin);
router.put('/admin/:id', auth, admin, atualizarServicoAdmin);
router.delete('/admin/:id', auth, admin, deletarServicoAdmin);

module.exports = router;