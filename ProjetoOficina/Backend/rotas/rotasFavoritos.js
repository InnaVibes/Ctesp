const express = require('express');
const {
    adicionarFavorito,
    removerFavorito,
    listarFavoritos
} = require('../controladores/controladorFavorito');
const { auth } = require('../middlewares/autorizacao');
const router = express.Router();

// Todas as rotas requerem autenticação
router.use(auth);

router.post('/', adicionarFavorito);
router.delete('/:catalogoServicoId', removerFavorito);
router.get('/', listarFavoritos);

module.exports = router;