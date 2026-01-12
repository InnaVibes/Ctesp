# Projeto: Gestão de Reservas e Serviços em Hotel Inteligente

## Descrição do Projeto

Sistema de gestão de reservas para um hotel inteligente com múltiplas unidades em Portugal (Lisboa, Porto, Coimbra, Faro e Braga). O projeto implementa soluções em XML/BaseX e JSON/MongoDB para análise e gestão de dados.

## Estrutura do Projeto

```
projeto/
├── hotel_reservas.xml          # Documento XML com dados das reservas
├── hotel_reservas.xsd          # XML Schema para validação
├── hotel_reservas.json         # Dados em formato JSON para MongoDB
├── consultas.xq                # Consultas XQuery para BaseX
├── api.xqm                     # Módulo REST API em RESTXQ
├── consultas_mongodb.js        # Consultas MongoDB
├── API_HTTP_Requests.txt       # Documentação dos endpoints da API
├── BaseX_Setup.txt             # Guia de instalação do BaseX
├── MongoDB_Setup.txt           # Guia de configuração do MongoDB Atlas
└── README.txt                  # Este ficheiro
```

## Requisitos

### Software Necessário

1. BaseX (versão 9.0 ou superior)
   - Download: https://basex.org/download/

2. MongoDB Atlas (conta gratuita)
   - Criar conta em: https://www.mongodb.com/cloud/atlas

3. MongoDB Compass (opcional, mas recomendado)
   - Download: https://www.mongodb.com/products/compass

4. Navegador web (Chrome, Firefox, Edge)

5. Cliente REST (opcional):
   - Postman: https://www.postman.com/
   - curl (linha de comandos)

## Instalação e Configuração

### Parte 1: XML e BaseX

1. Instalar BaseX seguindo o guia em BaseX_Setup.txt

2. Criar base de dados:
   ```
   - Abrir BaseX GUI
   - Database > New
   - Nome: hotel
   - Selecionar ficheiro: hotel_reservas.xml
   ```

3. Validar XML com Schema:
   ```
   - Abrir hotel_reservas.xml
   - Tools > Validate
   - Selecionar hotel_reservas.xsd
   ```

4. Executar consultas XQuery:
   ```
   - Abrir consultas.xq
   - Executar cada consulta individualmente (F5)
   ```

5. Configurar REST API:
   ```
   - Copiar api.xqm para pasta webapp do BaseX
   - Iniciar servidor: basexhttp
   - Testar em: http://localhost:8984/api/reservas
   ```

### Parte 2: JSON e MongoDB

1. Configurar MongoDB Atlas seguindo o guia em MongoDB_Setup.txt

2. Criar base de dados e collection:
   ```
   - Database: hotel_inteligente
   - Collection: reservas
   ```

3. Importar dados:
   ```
   - Via MongoDB Compass: Import JSON file (hotel_reservas.json)
   - Ou via mongoimport (ver MongoDB_Setup.txt)
   ```

4. Executar consultas:
   ```
   - Abrir MongoDB Compass
   - Ir para Aggregations
   - Copiar e executar consultas de consultas_mongodb.js
   ```

5. Criar Dashboard com MongoDB Charts:
   ```
   - Ativar Charts no Atlas
   - Criar dashboard "Hotel Inteligente"
   - Adicionar pelo menos 2 gráficos
   ```

## Funcionalidades Implementadas

### API REST (BaseX)

1. GET /api/reservas/hospede/{numero_cliente}
   - Retorna todas as reservas de um hóspede específico

2. GET /api/reservas/por-unidade
   - Retorna quantidade de reservas por unidade hoteleira

3. GET /api/servicos/total
   - Retorna total de serviços adicionais vendidos

### Consultas MongoDB

1. Número total de serviços vendidos por tipo
2. Quantidade de reservas por unidade
3. Valor médio das reservas
4. Maior valor de reserva
5. Todos os dados de uma reserva específica

### Dashboard MongoDB Charts

Mínimo de 2 gráficos:
- Reservas por Unidade (Bar Chart)
- Serviços Adicionais Vendidos (Bar Chart)
- Opcionais: Distribuição de Valor, Estatísticas Gerais

## Como Testar

### Testar API REST

1. Iniciar servidor BaseX:
   ```bash
   basexhttp
   ```

2. Testar endpoints no browser:
   ```
   http://localhost:8984/api/reservas/hospede/CLI123
   http://localhost:8984/api/reservas/por-unidade
   http://localhost:8984/api/servicos/total
   ```

3. Ou usar curl:
   ```bash
   curl http://localhost:8984/api/reservas/hospede/CLI123
   ```

### Testar Consultas MongoDB

1. Conectar ao MongoDB Atlas via Compass

2. Selecionar database: hotel_inteligente

3. Na collection reservas, ir ao tab "Aggregations"

4. Copiar e executar consultas de consultas_mongodb.js

## Dados de Teste

O projeto inclui dados de exemplo:
- 10 reservas
- 5 unidades (LS, PO, CB, FR, BR)
- 5 hóspedes diferentes
- 4 tipos de serviços (Spa, Restaurante, Transporte, Lavandaria)

### Números de Cliente para Teste:
- CLI123 (João Silva) - 2 reservas
- CLI456 (Maria Santos) - 2 reservas
- CLI789 (Pedro Costa) - 1 reserva
- CLI321 (Ana Ferreira) - 1 reserva
- CLI654 (Carlos Oliveira) - 1 reserva

## Validações Implementadas

### XML Schema:
- Número de cliente: 3 letras + 3 números
- NIF: 9 dígitos
- Unidade: apenas siglas válidas (LS, PO, CB, FR, BR)
- Máximo 4 serviços adicionais por reserva
- Datas no formato ISO (YYYY-MM-DD)
- Valores decimais para preços

## Troubleshooting

### BaseX não inicia:
- Verificar se porta 8984 está livre
- Ver logs em .basex/.logs

### MongoDB não conecta:
- Verificar credenciais
- Confirmar IP whitelist (0.0.0.0/0 para desenvolvimento)
- Verificar connection string

### API não responde:
- Verificar se api.xqm está na pasta webapp
- Reiniciar servidor BaseX
- Verificar base de dados "hotel" está criada

### Validação XML falha:
- Verificar encoding UTF-8
- Confirmar paths do Schema
- Verificar dados de acordo com restrições

## Estrutura de Dados

### Campos Principais:
- numero_reserva: Identificador único da reserva
- hospede: Dados completos do cliente
- check_in/check_out: Datas da estadia
- valor_total: Valor total da reserva
- unidade: Sigla da unidade hoteleira
- servicos_adicionais: Array de serviços contratados

## Próximos Passos

1. Capturar screenshots de todos os resultados
2. Organizar screenshots em documento Word/PDF
3. Criar apresentação PowerPoint para defesa
4. Testar todos os endpoints e consultas
5. Verificar que dashboard MongoDB está funcional
6. Preparar ficheiro ZIP para entrega

## Informações de Entrega

- Formato: PEID_DWDM_[A]_<num_grupo>.zip
- Prazo: 13 de janeiro de 2026, 23:55
- Plataforma: Moodle
- Ambos os elementos devem submeter

## Defesa do Trabalho

- Data: Época Normal (dia do exame)
- Duração: ~15 minutos
- Apresentação em PowerPoint
- Demonstração ao vivo das funcionalidades

## Autores

[Adicionar nomes e números dos elementos do grupo]

## Notas

- Evitar caminhos absolutos nos ficheiros
- Documentar bem todas as consultas
- Manter código limpo e comentado
- Testar todas as funcionalidades antes da entrega
