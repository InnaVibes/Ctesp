(: Consultas XQuery para o projeto Hotel Inteligente :)

(: ============================================ :)
(: Consulta 1: Reservas de um dado hóspede :)
(: ============================================ :)

(: Parâmetro: $numero_cliente :)
declare variable $numero_cliente external := "CLI123";

<resultado>
  <consulta>Reservas do hóspede {$numero_cliente}</consulta>
  <reservas>
  {
    for $reserva in doc("hotel_reservas.xml")//reserva
    where $reserva/hospede/numero_cliente = $numero_cliente
    return $reserva
  }
  </reservas>
</resultado>

(: ============================================ :)
(: Consulta 2: Quantidade de reservas por unidade :)
(: ============================================ :)

<resultado>
  <consulta>Quantidade de reservas por unidade</consulta>
  <unidades>
  {
    for $unidade in distinct-values(doc("hotel_reservas.xml")//unidade)
    let $total := count(doc("hotel_reservas.xml")//reserva[unidade = $unidade])
    order by $unidade
    return
      <unidade>
        <sigla>{$unidade}</sigla>
        <total_reservas>{$total}</total_reservas>
      </unidade>
  }
  </unidades>
</resultado>

(: ============================================ :)
(: Consulta 3: Total de serviços adicionais vendidos :)
(: ============================================ :)

<resultado>
  <consulta>Total de serviços adicionais vendidos em todas as unidades</consulta>
  <servicos>
  {
    for $nome_servico in distinct-values(doc("hotel_reservas.xml")//servico/nome)
    let $total_quantidade := sum(doc("hotel_reservas.xml")//servico[nome = $nome_servico]/quantidade)
    let $total_valor := sum(
      for $servico in doc("hotel_reservas.xml")//servico[nome = $nome_servico]
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
    <quantidade_global>{sum(doc("hotel_reservas.xml")//servico/quantidade)}</quantidade_global>
    <valor_global>{
      sum(
        for $servico in doc("hotel_reservas.xml")//servico
        return $servico/preco * $servico/quantidade
      )
    }</valor_global>
  </totais>
</resultado>
