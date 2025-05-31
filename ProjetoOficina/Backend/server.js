const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// Importar rotas
const rotasUser = require('./rotas/rotasUser');
const rotasServico = require('./rotas/rotasServico');
const rotasVeiculo = require('./rotas/rotasVeiculo');
const rotasCatalogo = require('./rotas/rotasCatalogo');
const rotasFavoritos = require('./rotas/rotasFavoritos');
const rotasAvaliacoes = require('./rotas/rotasAvaliacoes');

// Inicializar o app Express
const app = express();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
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
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Criar diretório de uploads se não existir
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Rotas principais
app.use('/api/users', rotasUser);
app.use('/api/servicos', rotasServico);
app.use('/api/veiculos', rotasVeiculo);
app.use('/api/catalogo', rotasCatalogo);
app.use('/api/favoritos', rotasFavoritos);
app.use('/api/avaliacoes', rotasAvaliacoes);

// Rota para upload de imagens
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhuma imagem enviada' });
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ 
            message: 'Imagem enviada com sucesso',
            imageUrl: imageUrl 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware de tratamento de erros do multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Arquivo muito grande. Máximo 5MB.' });
        }
    }
    
    if (error.message === 'Apenas imagens são permitidas!') {
        return res.status(400).json({ message: error.message });
    }
    
    next(error);
});

// Rota de teste
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Serviços Automotivos funcionando!',
        version: '2.0.0',
        endpoints: {
            auth: '/api/users',
            servicos: '/api/servicos', 
            veiculos: '/api/veiculos',
            catalogo: '/api/catalogo',
            favoritos: '/api/favoritos',
            avaliacoes: '/api/avaliacoes',
            upload: '/api/upload'
        }
    });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong dude!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

module.exports = app;