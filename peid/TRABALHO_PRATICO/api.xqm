module namespace page = 'http://basex.org/examples/web-page';

(: Namespaces OBRIGATÓRIOS :)
declare namespace db = "http://basex.org/modules/db";
declare namespace xs = "http://www.w3.org/2001/XMLSchema";

(: 
   Endpoint 1: Reservas de um hóspede 
   URL: http://localhost:8080/reservas/CLI001
:)
declare
  %rest:path("reservas/{$id}")
  %rest:GET
function page:reservas-cliente($id as xs:string) {
  <resultado_cliente>
    {
      (: Alterado para db:get conforme sugerido :)
      let $db := db:get('hotel')
      
      for $r in $db/hotel/reserva
      where $r/hospede/id_cliente = $id
      return $r
    }
  </resultado_cliente>
};

(: 
   Endpoint 2: Quantidade por Unidade 
   URL: http://localhost:8080/estatisticas/unidades
:)
declare
  %rest:path("estatisticas/unidades")
  %rest:GET
function page:reservas-por-unidade() {
  <estatisticas_unidades>
    {
      let $db := db:get('hotel')
      let $unidades := distinct-values($db/hotel/reserva/unidade)
      
      for $u in $unidades
      let $qtd := count($db/hotel/reserva[unidade = $u])
      return 
        <unidade sigla="{$u}">
          <total_reservas>{$qtd}</total_reservas>
        </unidade>
    }
  </estatisticas_unidades>
};

(: 
   Endpoint 3: Total de Serviços 
   URL: http://localhost:8080/estatisticas/servicos/total
:)
declare
  %rest:path("estatisticas/servicos/total")
  %rest:GET
function page:total-servicos() {
  <vendas_globais>
    {
      let $db := db:get('hotel')
      let $total := sum($db/hotel/reserva/servicos_adicionais/servico/quantidade)
      
      return <total_servicos_vendidos>{$total}</total_servicos_vendidos>
    }
  </vendas_globais>
};