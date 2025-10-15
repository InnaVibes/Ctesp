const mongoose = require('mongoose');
const CatalogoServico = require('./Backend/modelos/CatalogoServico');
const User = require('./Backend/modelos/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Dados fictícios para popular o catálogo
const servicosFicticios = [
    {
        name: "Troca de Óleo e Filtro",
        description: "Troca completa do óleo do motor e filtro de óleo. Inclui verificação dos níveis de fluidos e inspeção visual do motor.",
        category: "Manutenção Preventiva",
        basePrice: 89.99,
        estimatedDuration: "30 minutos",
        tags: ["óleo", "filtro", "motor", "manutenção", "preventiva", "básico"],
        difficulty: "easy",
        requiredParts: ["Óleo do motor", "Filtro de óleo", "Anel de vedação"],
        warranty: "30 dias ou 5.000 km",
        isActive: true
    },
    {
        name: "Alinhamento e Balanceamento",
        description: "Alinhamento das rodas dianteiras e traseiras com balanceamento completo. Melhora a condução e evita desgaste irregular dos pneus.",
        category: "Pneus e Rodas",
        basePrice: 120.00,
        estimatedDuration: "1 hora",
        tags: ["alinhamento", "balanceamento", "pneus", "rodas", "direção"],
        difficulty: "medium",
        requiredParts: ["Chumbo para balanceamento"],
        warranty: "90 dias",
        isActive: true
    },
    {
        name: "Revisão dos Travões",
        description: "Inspeção completa do sistema de travão incluindo pastilhas, discos, liquido e tubagens. Substituição de peças conforme necessário.",
        category: "Travão",
        basePrice: 180.00,
        estimatedDuration: "2 horas",
        tags: ["travao", "pastilhas", "discos", "segurança", "fluido"],
        difficulty: "medium",
        requiredParts: ["Pastilhas de travão", "Liquido de travão", "Discos de travão"],
        warranty: "6 meses ou 10.000 km",
        isActive: true
    },
    {
        name: "Troca da Bateria",
        description: "Substituição da bateria do veículo com teste do sistema de carregamento. Inclui limpeza dos terminais e verificação do alternador.",
        category: "Sistema Elétrico",
        basePrice: 299.99,
        estimatedDuration: "45 minutos",
        tags: ["bateria", "elétrico", "alternador", "partida"],
        difficulty: "easy",
        requiredParts: ["Bateria automovel", "Isolante de terminais"],
        warranty: "12 meses",
        isActive: true
    },
    {
        name: "Limpeza do Sistema de Arrefecimento",
        description: "Limpeza completa do sistema de arrefecimento, incluindo radiador, tubagens e reservatório. Substituição do fluido de arrefecimento.",
        category: "Arrefecimento",
        basePrice: 150.00,
        estimatedDuration: "1 hora e 30 minutos",
        tags: ["arrefecimento", "radiador", "fluido", "mangueiras"],
        difficulty: "medium",
        requiredParts: ["Fluido de arrefecimento", "Mangueiras de arrefecimento"],
        warranty: "6 meses",
        isActive: true
    },
    {
        name: "Diagnóstico Completo",
        description: "Diagnóstico completo do veículo com scanner automotivo. Identifica problemas no motor, transmissão, freios e sistemas eletrônicos.",
        category: "Diagnóstico",
        basePrice: 75.00,
        estimatedDuration: "1 hora",
        tags: ["diagnóstico", "scanner", "eletrônica", "motor", "análise"],
        difficulty: "medium",
        requiredParts: [],
        warranty: "15 dias",
        isActive: true
    },
    {
        name: "Troca de Pastilhas de Freio",
        description: "Substituição das pastilhas de freio dianteiras e traseiras. Inclui inspeção dos discos e verificação do sistema de freio.",
        category: "Travão",
        basePrice: 200.00,
        estimatedDuration: "1 hora e 30 minutos",
        tags: ["pastilhas", "freio", "travão", "segurança", "discos"],
        difficulty: "medium",
        requiredParts: ["Pastilhas de freio", "Spray para freios"],
        warranty: "6 meses ou 15.000 km",
        isActive: true
    },
    {
        name: "Revisão do Ar Condicionado",
        description: "Limpeza e manutenção do sistema de ar condicionado. Inclui troca de filtros, verificação de gás e limpeza do evaporador.",
        category: "Climatização",
        basePrice: 130.00,
        estimatedDuration: "1 hora e 30 minutos",
        tags: ["ar condicionado", "filtro", "climatização", "gás", "evaporador"],
        difficulty: "medium",
        requiredParts: ["Filtro do ar condicionado", "Gás refrigerante"],
        warranty: "3 meses",
        isActive: true
    },
    {
        name: "Troca de Amortecedores",
        description: "Substituição dos amortecedores dianteiros e traseiros. Melhora o conforto de condução e a estabilidade do veículo.",
        category: "Suspensão",
        basePrice: 450.00,
        estimatedDuration: "3 horas",
        tags: ["amortecedores", "suspensão", "conforto", "estabilidade"],
        difficulty: "hard",
        requiredParts: ["Amortecedores", "Bieletas", "Buchas"],
        warranty: "12 meses ou 20.000 km",
        isActive: true
    },
    {
        name: "Limpeza de Bicos Injetores",
        description: "Limpeza ultrassônica dos bicos injetores para melhorar a performance do motor e reduzir o consumo de combustível.",
        category: "Injeção Eletrônica",
        basePrice: 95.00,
        estimatedDuration: "2 horas",
        tags: ["bicos", "injetores", "limpeza", "performance", "combustível"],
        difficulty: "medium",
        requiredParts: ["Produtos de limpeza", "Filtros"],
        warranty: "6 meses",
        isActive: true
    }
];

// Usuários fictícios para teste
const usuariosFicticios = [
    {
        name: 'Administrador',
        email: 'admin@oficina.com',
        password: 'admin123',
        role: 'admin',
        phone: '+351 912 345 678',
        isActive: true
    },
    {
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'cliente123',
        role: 'client',
        phone: '+351 913 456 789',
        isActive: true
    },
    {
        name: 'Maria Santos',
        email: 'maria@email.com',
        password: 'cliente123',
        role: 'client',
        phone: '+351 914 567 890',
        isActive: true
    },
    {
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        password: 'cliente123',
        role: 'client',
        phone: '+351 915 678 901',
        isActive: true
    }
];

// Função principal para popular a base de dados
const seedDatabase = async () => {
    try {
        console.log('🔄 Conectando à base de dados...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Conectado à base de dados MongoDB');

        // Limpar dados existentes
        console.log('🧹 Limpando dados existentes...');
        await CatalogoServico.deleteMany({});
        await User.deleteMany({});
        console.log('✅ Dados existentes removidos');

        // Criar usuários com senhas hasheadas
        console.log('👥 Criando usuários...');
        const usuariosComSenhasHash = await Promise.all(
            usuariosFicticios.map(async (usuario) => ({
                ...usuario,
                password: await bcrypt.hash(usuario.password, 10)
            }))
        );

        const usuariosCriados = await User.insertMany(usuariosComSenhasHash);
        console.log(`✅ ${usuariosCriados.length} usuários criados`);

        // Inserir serviços do catálogo
        console.log('🛠️ Inserindo serviços no catálogo...');
        const servicosCriados = await CatalogoServico.insertMany(servicosFicticios);
        console.log(`✅ ${servicosCriados.length} serviços criados no catálogo`);

        // Mostrar informações de login
        console.log('\n📋 Informações de Login:');
        console.log('==========================================');
        console.log('🔑 ADMIN:');
        console.log('   Email: admin@oficina.com');
        console.log('   Senha: admin123');
        console.log('\n👤 CLIENTES DE TESTE:');
        usuariosFicticios.filter(u => u.role === 'client').forEach(usuario => {
            console.log(`   📧 ${usuario.email} | 🔐 ${usuario.password}`);
        });
        console.log('==========================================\n');

        console.log('🎉 Base de dados populada com sucesso!');
        console.log(`📊 Total: ${usuariosCriados.length} usuários + ${servicosCriados.length} serviços`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao popular a base de dados:', error);
        process.exit(1);
    }
};

// Função para apenas criar usuários
const seedUsers = async () => {
    try {
        console.log('🔄 Conectando à base de dados...');
        await mongoose.connect(process.env.MONGO_URI);

        console.log('👥 Criando apenas usuários...');
        await User.deleteMany({});

        const usuariosComSenhasHash = await Promise.all(
            usuariosFicticios.map(async (usuario) => ({
                ...usuario,
                password: await bcrypt.hash(usuario.password, 10)
            }))
        );

        await User.insertMany(usuariosComSenhasHash);
        console.log('✅ Usuários criados com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao criar usuários:', error);
        process.exit(1);
    }
};

// Função para apenas criar serviços
const seedServices = async () => {
    try {
        console.log('🔄 Conectando à base de dados...');
        await mongoose.connect(process.env.MONGO_URI);

        console.log('🛠️ Criando apenas serviços...');
        await CatalogoServico.deleteMany({});
        await CatalogoServico.insertMany(servicosFicticios);
        console.log('✅ Serviços criados com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao criar serviços:', error);
        process.exit(1);
    }
};

// Executar se chamado diretamente
if (require.main === module) {
    const comando = process.argv[2];
    
    switch (comando) {
        case 'users':
            seedUsers();
            break;
        case 'services':
            seedServices();
            break;
        default:
            seedDatabase();
            break;
    }
}

module.exports = { 
    seedDatabase, 
    seedUsers, 
    seedServices, 
    servicosFicticios, 
    usuariosFicticios 
};