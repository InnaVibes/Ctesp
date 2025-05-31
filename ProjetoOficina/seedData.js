const mongoose = require('mongoose');
const CatalogoServico = require('./modelos/CatalogoServico');
require('dotenv').config();

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
        warranty: "30 dias ou 5.000 km"
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
        warranty: "90 dias"
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
        warranty: "6 meses ou 10.000 km"
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
        warranty: "12 meses"
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
        warranty: "6 meses"
    }
];