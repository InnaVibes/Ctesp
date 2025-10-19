const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Todas as rotas são protegidas
router.use(protect);

// Validação de método de pagamento
const validatePayment = [
  body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer'])
    .withMessage('Método de pagamento inválido')
];

// Rotas de compra
router.post('/checkout', validatePayment, handleValidationErrors, purchaseController.checkoutCart);
router.post('/game/:gameId', validatePayment, handleValidationErrors, purchaseController.purchaseGame);

// Histórico de transações
router.get('/history', purchaseController.getTransactionHistory);
router.get('/transaction/:transactionId', purchaseController.getTransaction);

module.exports = router;