const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

// Importar rotas
const rotasAuth = require('./rotas/rotasAuth');
const rotasUser = require('./rotas/rotasUser'); // Manter compatibilidade
const rotasServico = require('./rotas/rotasServico');
const rotasVeiculo = require('./rotas/rotasVeiculo');
const rotasCatalogo = require('./rotas/rotasCatalogo');
const rotasFavoritos = require('./rotas/rotasFavoritos');
const rotasAvaliacoes = require('./rotas/rotasAvaliacoes');

// Inicializar o app Express
const app = express();

// Middleware de segurança
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compressão
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP por janela de tempo
    message: {
        error: 'Muitas tentativas. Tente novamente em 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Rate limiting mais restritivo para auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 tentativas de login por IP
    message: {
        error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    }
});

// Configuração do CORS
app.use(cors({
    origin: function (origin, callback) {
        // Lista de origens permitidas
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://localhost:5173', // Vite dev server
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173'
        ];
        
        // Permitir requests sem origin (mobile apps, etc)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pelo CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware para parsing
app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            res.status(400).json({ error: 'JSON inválido' });
            throw new Error('JSON inválido');
        }
    }
}));
app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
}));

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Criar diretórios se não existirem
        const fs = require('fs');
        const uploadDir = 'uploads';
        const serviceDir = 'uploads/servicos';
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        if (!fs.existsSync(serviceDir)) {
            fs.mkdirSync(serviceDir);
        }
        
        cb(null, 'uploads/servicos/');
    },
    filename: function (req, file, cb) {
        // Gerar nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    // Verificar tipo de arquivo
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5 // máximo 5 arquivos
    }
});

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '1d', // Cache por 1 dia
    etag: true
})); 

// Middleware de logging (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Rotas da API
app.use('/api/auth', authLimiter, rotasAuth);
app.use('/api/users', rotasUser); // Manter para compatibilidade
app.use('/api/servicos', rotasServico);
app.use('/api/veiculos', rotasVeiculo);
app.use('/api/catalogo', rotasCatalogo);
app.use('/api/favoritos', rotasFavoritos);
app.use('/api/avaliacoes', rotasAvaliacoes);

// Rota para upload de imagens
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'Nenhuma imagem enviada' 
            });
        }
        
        const imageUrl = `/uploads/servicos/${req.file.filename}`;
        res.json({ 
            success: true,
            message: 'Imagem enviada com sucesso',
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erro interno no upload' 
        });
    }
});

// Rota para upload múltiplo
app.post('/api/upload/multiple', upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Nenhuma imagem enviada' 
            });
        }
        
        const imageUrls = req.files.map(file => `/uploads/servicos/${file.filename}`);
        
        res.json({ 
            success: true,
            message: `${req.files.length} imagens enviadas com sucesso`,
            imageUrls: imageUrls,
            filenames: req.files.map(file => file.filename)
        });
    } catch (error) {
        console.error('Erro no upload múltiplo:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erro interno no upload' 
        });
    }
});

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Rota principal da API
app.get('/api', (req, res) => {
    res.json({ 
        message: 'API de Serviços Automotivos funcionando!',
        version: '2.0.0',
        documentation: '/api/docs',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            servicos: '/api/servicos', 
            veiculos: '/api/veiculos',
            catalogo: '/api/catalogo',
            favoritos: '/api/favoritos',
            avaliacoes: '/api/avaliacoes',
            upload: '/api/upload',
            health: '/api/health'
        }
    });
});

// Rota de documentação simples
app.get('/api/docs', (req, res) => {
    res.json({
        title: 'API Oficina Mecânica',
        version: '2.0.0',
        description: 'API para gestão de oficina mecânica',
        endpoints: {
            auth: {
                'POST /api/auth/register': 'Registrar usuário',
                'POST /api/auth/login': 'Login',
                'GET /api/auth/profile': 'Obter perfil',
                'PUT /api/auth/profile': 'Atualizar perfil',
                'POST /api/auth/logout': 'Logout',
                'POST /api/auth/forgot-password': 'Recuperar senha',
                'POST /api/auth/reset-password/:token': 'Resetar senha'
            },
            servicos: {
                'GET /api/servicos': 'Listar serviços',
                'POST /api/servicos': 'Criar serviço',
                'GET /api/servicos/:id': 'Obter serviço',
                'PUT /api/servicos/:id': 'Atualizar serviço',
                'DELETE /api/servicos/:id': 'Deletar serviço',
                'PUT /api/servicos/:id/confirmar': 'Confirmar serviço (admin)',
                'GET /api/servicos/relatorios': 'Relatórios (admin)',
                'GET /api/servicos/historico/:veiculoId': 'Histórico por veículo'
            },
            veiculos: {
                'GET /api/veiculos': 'Listar veículos',
                'POST /api/veiculos': 'Criar veículo',
                'GET /api/veiculos/:id': 'Obter veículo',
                'PUT /api/veiculos/:id': 'Atualizar veículo',
                'DELETE /api/veiculos/:id': 'Deletar veículo'
            },
            catalogo: {
                'GET /api/catalogo': 'Listar catálogo',
                'GET /api/catalogo/:id': 'Detalhes do serviço',
                'GET /api/catalogo/categorias': 'Listar categorias',
                'GET /api/catalogo/tags': 'Listar tags',
                'POST /api/catalogo/admin': 'Criar serviço (admin)',
                'PUT /api/catalogo/admin/:id': 'Atualizar serviço (admin)',
                'DELETE /api/catalogo/admin/:id': 'Deletar serviço (admin)'
            },
            favoritos: {
                'GET /api/favoritos': 'Listar favoritos',
                'POST /api/favoritos': 'Adicionar favorito',
                'DELETE /api/favoritos/:catalogoServicoId': 'Remover favorito'
            },
            avaliacoes: {
                'POST /api/avaliacoes': 'Criar avaliação',
                'GET /api/avaliacoes/minhas': 'Minhas avaliações',
                'PUT /api/avaliacoes/:id': 'Atualizar avaliação',
                'DELETE /api/avaliacoes/:id': 'Deletar avaliação',
                'PUT /api/avaliacoes/admin/:id/aprovar': 'Aprovar avaliação (admin)',
                'GET /api/avaliacoes/admin/pendentes': 'Avaliações pendentes (admin)'
            },
            upload: {
                'POST /api/upload': 'Upload de imagem única',
                'POST /api/upload/multiple': 'Upload de múltiplas imagens'
            }
        }
    });
});

// Middleware de tratamento de erros do multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false,
                message: 'Arquivo muito grande. Máximo 5MB por arquivo.' 
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
                success: false,
                message: 'Muitos arquivos. Máximo 5 arquivos por upload.' 
            });
        }
        return res.status(400).json({ 
            success: false,
            message: `Erro no upload: ${error.message}` 
        });
    }
    
    if (error.message === 'Apenas imagens são permitidas!') {
        return res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
    
    next(error);
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    
    // Erro de validação do Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors
        });
    }
    
    // Erro de cast do Mongoose (ID inválido)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'ID inválido fornecido'
        });
    }
    
    // Erro de duplicação (chave única)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field} já existe no sistema`
        });
    }
    
    // Erro de JSON malformado
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'JSON malformado'
        });
    }
    
    // Erro de CORS
    if (err.message === 'Não permitido pelo CORS') {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado pelo CORS'
        });
    }
    
    // Erro de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expirado'
        });
    }
    
    // Erro de conexão com banco de dados
    if (err.name === 'MongoError' || err.name === 'MongooseError') {
        return res.status(503).json({
            success: false,
            message: 'Erro de conexão com o banco de dados'
        });
    }
    
    // Erro padrão do servidor
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Erro interno do servidor' 
            : err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Middleware para rotas não encontradas (404)
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
        availableEndpoints: '/api/docs'
    });
});

module.exports = app;