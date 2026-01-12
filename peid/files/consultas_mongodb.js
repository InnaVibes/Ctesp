// Consultas MongoDB para o projeto Hotel Inteligente

// ============================================
// Consulta 1: Número total de serviços vendidos por tipo
// ============================================

db.reservas.aggregate([
  { $unwind: "$servicos_adicionais" },
  {
    $group: {
      _id: "$servicos_adicionais.nome",
      total_quantidade: { $sum: "$servicos_adicionais.quantidade" },
      total_valor: {
        $sum: {
          $multiply: [
            "$servicos_adicionais.preco",
            "$servicos_adicionais.quantidade"
          ]
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      tipo_servico: "$_id",
      total_quantidade: 1,
      total_valor: { $round: ["$total_valor", 2] }
    }
  },
  { $sort: { tipo_servico: 1 } }
])

// ============================================
// Consulta 2: Quantidade de reservas por unidade
// ============================================

db.reservas.aggregate([
  {
    $group: {
      _id: "$unidade",
      total_reservas: { $sum: 1 },
      valor_total: { $sum: "$valor_total" }
    }
  },
  {
    $project: {
      _id: 0,
      unidade: "$_id",
      total_reservas: 1,
      valor_total: { $round: ["$valor_total", 2] }
    }
  },
  { $sort: { unidade: 1 } }
])

// ============================================
// Consulta 3: Valor médio das reservas
// ============================================

db.reservas.aggregate([
  {
    $group: {
      _id: null,
      valor_medio: { $avg: "$valor_total" },
      total_reservas: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      valor_medio: { $round: ["$valor_medio", 2] },
      total_reservas: 1
    }
  }
])

// ============================================
// Consulta 4: Maior valor de reserva
// ============================================

db.reservas.find(
  {},
  {
    numero_reserva: 1,
    "hospede.nome": 1,
    valor_total: 1,
    unidade: 1,
    _id: 0
  }
).sort({ valor_total: -1 }).limit(1)

// Alternativa com aggregate:
db.reservas.aggregate([
  { $sort: { valor_total: -1 } },
  { $limit: 1 },
  {
    $project: {
      _id: 0,
      numero_reserva: 1,
      hospede_nome: "$hospede.nome",
      valor_total: 1,
      unidade: 1,
      check_in: 1,
      check_out: 1
    }
  }
])

// ============================================
// Consulta 5: Todos os dados de uma reserva específica
// ============================================

// Por número de reserva:
db.reservas.find(
  { numero_reserva: "RES001" }
)

// Mais legível:
db.reservas.findOne(
  { numero_reserva: "RES001" }
)

// ============================================
// CONSULTAS ADICIONAIS ÚTEIS
// ============================================

// Estatísticas gerais:
db.reservas.aggregate([
  {
    $group: {
      _id: null,
      total_reservas: { $sum: 1 },
      valor_medio: { $avg: "$valor_total" },
      valor_minimo: { $min: "$valor_total" },
      valor_maximo: { $max: "$valor_total" },
      valor_total: { $sum: "$valor_total" }
    }
  },
  {
    $project: {
      _id: 0,
      total_reservas: 1,
      valor_medio: { $round: ["$valor_medio", 2] },
      valor_minimo: { $round: ["$valor_minimo", 2] },
      valor_maximo: { $round: ["$valor_maximo", 2] },
      valor_total: { $round: ["$valor_total", 2] }
    }
  }
])

// Reservas por cliente:
db.reservas.aggregate([
  {
    $group: {
      _id: "$hospede.numero_cliente",
      nome: { $first: "$hospede.nome" },
      total_reservas: { $sum: 1 },
      valor_total_gasto: { $sum: "$valor_total" }
    }
  },
  {
    $project: {
      _id: 0,
      numero_cliente: "$_id",
      nome: 1,
      total_reservas: 1,
      valor_total_gasto: { $round: ["$valor_total_gasto", 2] }
    }
  },
  { $sort: { total_reservas: -1 } }
])

// Top 5 clientes que mais gastaram:
db.reservas.aggregate([
  {
    $group: {
      _id: "$hospede.numero_cliente",
      nome: { $first: "$hospede.nome" },
      total_gasto: { $sum: "$valor_total" },
      total_reservas: { $sum: 1 }
    }
  },
  { $sort: { total_gasto: -1 } },
  { $limit: 5 },
  {
    $project: {
      _id: 0,
      numero_cliente: "$_id",
      nome: 1,
      total_gasto: { $round: ["$total_gasto", 2] },
      total_reservas: 1
    }
  }
])

// Serviços mais populares:
db.reservas.aggregate([
  { $unwind: "$servicos_adicionais" },
  {
    $group: {
      _id: "$servicos_adicionais.nome",
      vezes_comprado: { $sum: 1 },
      quantidade_total: { $sum: "$servicos_adicionais.quantidade" }
    }
  },
  {
    $project: {
      _id: 0,
      servico: "$_id",
      vezes_comprado: 1,
      quantidade_total: 1
    }
  },
  { $sort: { quantidade_total: -1 } }
])
