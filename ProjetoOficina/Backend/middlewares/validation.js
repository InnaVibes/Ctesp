const Joi = require('joi');

const schemas = {
    user: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().min(10).max(15),
        role: Joi.string().valid('client', 'admin').default('client')
    }),
    
    veiculo: Joi.object({
        make: Joi.string().required(),
        model: Joi.string().required(),
        year: Joi.number().min(1900).max(new Date().getFullYear() + 1),
        licensePlate: Joi.string().required(),
        color: Joi.string()
    }),
    
    servico: Joi.object({
        type: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().positive().required(),
        estimatedTime: Joi.string(),
        scheduledDate: Joi.date().min('now').required(),
        observations: Joi.string(),
        veiculoId: Joi.string().required()
    })
};

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: 'Dados inválidos', 
                details: error.details[0].message 
            });
        }
        next();
    };
};

module.exports = { schemas, validate };