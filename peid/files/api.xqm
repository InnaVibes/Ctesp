xquery version "3.1";

module namespace api = "http://hotel.com/api";

(: ============================================ :)
(: API 1: Reservas de um dado hóspede :)
(: ============================================ :)

declare
  %rest:GET
  %rest:path("/api/reservas/hospede/{$numero_cliente}")
  %rest:produces("application/xml")
function api:reservas-hospede($numero_cliente as xs:string) {
  <resultado>
    <consulta>Reservas do hóspede {$numero_cliente}</consulta>
    <reservas>
    {
      for $reserva in db:open("hotel")//reserva
      where $reserva/hospede/numero_cliente = $numero_cliente
      return $reserva
    }
    </reservas>
  </resultado>
};

(: ============================================ :)
(: API 2: Quantidade de reservas por unidade :)
(: ============================================ :)

declare
  %rest:GET
  %rest:path("/api/reservas/por-unidade")
  %rest:produces("application/xml")
function api:reservas-por-unidade() {
  <resultado>
    <consulta>Quantidade de reservas por unidade</consulta>
    <unidades>
    {
      for $unidade in distinct-values(db:open("hotel")//unidade)
      let $total := count(db:open("hotel")//reserva[unidade = $unidade])
      order by $unidade
      return
        <unidade>
          <sigla>{$unidade}</sigla>
          <total_reservas>{$total}</total_reservas>
        </unidade>
    }
    </unidades>
  </resultado>
};

(: ============================================ :)
(: API 3: Total de serviços adicionais vendidos :)
(: ============================================ :)

declare
  %rest:GET
  %rest:path("/api/servicos/total")
  %rest:produces("application/xml")
function api:servicos-total() {
  <resultado>
    <consulta>Total de serviços adicionais vendidos</consulta>
    <servicos>
    {
      for $nome_servico in distinct-values(db:open("hotel")//servico/nome)
      let $total_quantidade := sum(db:open("hotel")//servico[nome = $nome_servico]/quantidade)
      let $total_valor := sum(
        for $servico in db:open("hotel")//servico[nome = $nome_servico]
        return $servico/preco * $servico/quantidade
      )
      order by $nome_servico
      return
        <servico>
          <nome>{$nome_servico}</nome>
          <quantidade_total>{$total_quantidade}</quantidade_total>
          <valor_total>{$total_valor}</valor_total>
        </servico>
    }
    </servicos>
    <totais>
      <quantidade_global>{sum(db:open("hotel")//servico/quantidade)}</quantidade_global>
      <valor_global>{
        sum(
          for $servico in db:open("hotel")//servico
          return $servico/preco * $servico/quantidade
        )
      }</valor_global>
    </totais>
  </resultado>
};

(: ============================================ :)
(: API Extra: Listar todas as reservas :)
(: ============================================ :)

declare
  %rest:GET
  %rest:path("/api/reservas")
  %rest:produces("application/xml")
function api:todas-reservas() {
  db:open("hotel")
};
