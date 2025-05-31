const Joi = require('joi');

const schemas = {
    user: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().pattern(/^[0-9]{9,15}$/).optional(),
        role: Joi.string().valid('client', 'admin').default('client')
    }),
    
    veiculo: Joi.object({
        make: Joi.string().required(),
        model: Joi.string().required(),
        year: Joi.number().min(1900).max(new Date().getFullYear() + 1),
        licensePlate: Joi.string().pattern(/^[A-Z0-9-]{6,8}$/).required(),
        color: Joi.string().optional()
    }),
    
    servico: Joi.object({
        type: Joi.string().required(),
        description: Joi.string().optional(),
        price: Joi.number().positive().required(),
        estimatedTime: Joi.string().optional(),
        scheduledDate: Joi.date().min('now').required(),
        observations: Joi.string().optional(),
        veiculoId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    
    avaliacao: Joi.object({
        catalogoServicoId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        rating: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().max(500).optional(),
        servicoId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional()
    })
};

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const details = error.details.map(detail => detail.message);
            return res.status(400).json({ 
                message: 'Dados inválidos', 
                details 
            });
        }
        next();
    };
};

module.exports = { schemas, validate };