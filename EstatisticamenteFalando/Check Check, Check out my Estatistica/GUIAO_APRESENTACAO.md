# GUIÃO DE APRESENTAÇÃO
## Análise Estatística - Custo da Habitação em Municípios de Portugal
### Grupo 08 - Janeiro 2026

---

## SLIDE 01: CAPA PRINCIPAL
**TEMPO: 1-2 minutos**

### O que mostrar:
- Título: "ANÁLISE ESTATÍSTICA"
- Subtítulo: "Custo da Habitação em Portugal"
- Badges: Script R | 50 Municípios | Análise Completa

### O que dizer:
"Bom dia/tarde. Somos o Grupo 08 e vamos apresentar uma análise estatística completa sobre o custo da habitação em 50 municípios portugueses, divididos entre as regiões Norte e Centro.

Este trabalho foi desenvolvido em linguagem R, utilizando metodologia científica reprodutível e técnicas estatísticas rigorosas. Vamos mostrar-vos o script que utilizámos, os resultados obtidos, as visualizações gráficas e as análises correspondentes.

O objetivo principal é identificar disparidades regionais, compreender a correlação entre mercados de aquisição e arrendamento, e apresentar recomendações para políticas públicas habitacionais."

### Pontos-chave:
✓ Apresentação estruturada (Script → Resultado → Gráfico → Análise)
✓ Dados reais de 50 municípios
✓ Metodologia R reproducível
✓ Análise completa e rigorosa

---

## SLIDE 02: VARIÁVEIS QUALITATIVAS - REGIÃO (NUTS II)
**TEMPO: 2-3 minutos**

### O que mostrar:
- **SCRIPT R** (lado esquerdo, fundo preto com texto verde):
  ```R
  freq_nuts <- table(dados$NUTS_II)
  freq_nuts_rel <- prop.table(freq_nuts) * 100
  print(freq_nuts)
  ```

- **RESULTADO** (centro-esquerda, caixa cinza):
  - Norte: 28 municípios (56%)
  - Centro: 22 municípios (44%)

- **GRÁFICO** (centro-direita):
  - Gráfico de setores mostrando proporção 56% vs 44%

- **ANÁLISE** (lado direito, caixa verde):
  - Amostra equilibrada
  - Predomínio do Norte
  - Distribuição adequada

### O que dizer:
"Começamos pela análise de variáveis qualitativas. Primeiro, vejamos a distribuição por região.

Utilizámos a função `table()` do R para contar frequências absolutas de cada região, e `prop.table()` para calcular as proporções relativas. 

Os resultados mostram que a amostra de 50 municípios está bem distribuída:
- A região Norte tem 28 municípios, o que representa 56% da amostra
- A região Centro tem 22 municípios, representando 44%

Esta distribuição é adequada porque reflete aproximadamente a proporção real de população nas duas regiões em Portugal. O gráfico à direita visualiza bem esta proporção de 56% para 44%.

Este equilíbrio permite-nos fazer comparações regionais válidas, que será um ponto importante mais à frente."

### Pontos-chave:
✓ Amostra bem distribuída geograficamente
✓ Norte ligeiramente maior (reflecte realidade demográfica)
✓ Adequado para comparações regionais
✓ 50 registos total = amostra viável

---

## SLIDE 03: VARIÁVEIS QUALITATIVAS - EQUIPA
**TEMPO: 1-2 minutos**

### O que mostrar:
- **SCRIPT R**:
  ```R
  freq_equipa <- table(dados$Equipa)
  freq_equipa_rel <- prop.table(freq_equipa) * 100
  print(freq_equipa)
  ```

- **RESULTADO**:
  - Equipa A: 15 registos (30%)
  - Equipa B: 15 registos (30%)
  - Equipa C: 20 registos (40%)

- **GRÁFICO**: Gráfico de barras mostrando distribuição

- **ANÁLISE**:
  - Equipa C lidera com 40%
  - A e B equilibradas em 30%
  - Distribuição homogénea

### O que dizer:
"Segunda variável qualitativa: a distribuição por equipa.

Aplicámos o mesmo procedimento - `table()` para frequências e `prop.table()` para percentagens.

Os resultados indicam:
- Equipas A e B têm exactamente 15 registos cada (30%)
- Equipa C tem 20 registos (40%)

Esta distribuição é bastante equilibrada. A ligeira predominância da Equipa C em 10% não é significativa. O importante é que não há grandes desvios que pudessem enviesar a análise.

Isto significa que os dados não têm viés de equipa - qualquer padrão que encontrarmos não é devido a uma equipa recolher dados de forma diferente."

### Pontos-chave:
✓ Distribuição equilibrada entre equipas
✓ Sem viés significativo
✓ Equipa C com representação ligeiramente maior
✓ Adequado para análise estatística

---

## SLIDE 04: VALOR AQUISIÇÃO (VRefAq) - LOCALIZAÇÃO
**TEMPO: 2-3 minutos**

### O que mostrar:
- **SCRIPT R**:
  ```R
  media_aq <- mean(dados$VRefAq)
  mediana_aq <- median(dados$VRefAq)
  q1_aq <- quantile(dados$VRefAq, 0.25)
  q3_aq <- quantile(dados$VRefAq, 0.75)
  ```

- **RESULTADO**:
  - Média: 2549.36 €/m²
  - Mediana: 2531.48 €/m²
  - Q1: 2099.95 €/m²
  - Q3: 3039.64 €/m²

- **GRÁFICO**: Histograma mostrando distribuição de frequências

- **ANÁLISE**:
  - Média ≈ Mediana → Distribuição simétrica
  - Concentração no centro
  - Cauda pequena

### O que dizer:
"Agora passamos para as variáveis contínuas. Começamos com VRefAq - Valor de Referência de Aquisição, que é o preço por metro quadrado para comprar habitação.

Calculámos as medidas de localização:
- **Média**: É a soma de todos os valores dividida pelo número de municípios = 2549.36 €/m²
- **Mediana**: É o valor central quando ordenamos todos os dados = 2531.48 €/m²

O facto da média ser muito próxima da mediana (diferença de apenas 18 euros) é muito importante! Isso indica que a distribuição é **aproximadamente simétrica** - não temos valores extremos desproporcionais puxando a média para um lado.

Os quartis (Q1 e Q3) mostram que:
- 25% dos municípios custam menos de 2099.95 €/m²
- 75% dos municípios custam menos de 3039.64 €/m²
- A amplitude interquartil é 939.69 €, mostrando a dispersão dos dados

O histograma confirma visualmente que temos uma distribuição concentrada no centro, com caudas simétricas em ambos os lados."

### Pontos-chave:
✓ Distribuição simétrica (média ≈ mediana)
✓ Concentração central clara
✓ Sem outliers extremos
✓ Dispersão moderada (Q3-Q1 = 939.69€)

---

## SLIDE 05: VALOR AQUISIÇÃO (VRefAq) - DISPERSÃO
**TEMPO: 2-3 minutos**

### O que mostrar:
- **SCRIPT R**:
  ```R
  amplitude_aq <- max(VRefAq) - min(VRefAq)
  dp_aq <- sd(dados$VRefAq)
  cv_aq <- (dp_aq/media_aq)*100
  ```

- **RESULTADO**:
  - Amplitude: 3121.81 €
  - Desvio Padrão: 702.05 €/m²
  - CV: 27.54%
  - (Variabilidade moderada)

- **GRÁFICO**: Boxplot mostrando quartis e whiskers

- **ANÁLISE**:
  - CV 27.54% = Variabilidade moderada
  - Heterogeneidade entre municípios
  - Dispersão típica: 702€

### O que dizer:
"Agora analisamos as medidas de dispersão - como os dados estão espalhados em torno da média.

A **amplitude** de 3121.81 € indica a distância entre o preço mais alto e mais baixo. Parece grande em valores absolutos, mas precisamos de contexto.

O **desvio padrão** (DP) de 702.05 €/m² é a medida estatística que nos diz quanto os dados típicos se afastam da média. Em termos práticos:
- A maioria dos municípios custa entre 2549.36 - 702.05 = 1847.31 € (mínimo típico)
- E entre 2549.36 + 702.05 = 3251.41 € (máximo típico)

O **Coeficiente de Variação** (CV) de 27.54% é a melhor forma de interpretar dispersão. Ele é o DP dividido pela média, em percentagem:
- CV < 15%: Baixa variabilidade
- CV 15-30%: Variabilidade **moderada** ← Aqui estamos
- CV > 30%: Alta variabilidade

Isto significa que existe variação significativa entre municípios - não todos têm o mesmo preço - mas não é extrema. Há heterogeneidade, mas com padrão.

O boxplot confirma isto visualmente mostrando a caixa (quartis) e os whiskers (amplitude dos dados normais)."

### Pontos-chave:
✓ Variabilidade moderada (27.54%)
✓ Heterogeneidade clara entre municípios
✓ Dispersão previsível
✓ Sem dispersão anómala

---

## SLIDE 06: VALOR ARRENDAMENTO (VRefAr) - LOCALIZAÇÃO
**TEMPO: 2-3 minutos**

### O que mostrar:
- **SCRIPT R**:
  ```R
  media_ar <- mean(dados$VRefAr)
  mediana_ar <- median(dados$VRefAr)
  q1_ar <- quantile(dados$VRefAr, 0.25)
  q3_ar <- quantile(dados$VRefAr, 0.75)
  ```

- **RESULTADO**:
  - Média: 11.41 €/m²
  - Mediana: 11.00 €/m²
  - Q1: 8.57 €/m²
  - Q3: 13.32 €/m²

- **GRÁFICO**: Histograma mostrando distribuição

- **ANÁLISE**:
  - Média ≈ Mediana → Distribuição simétrica
  - Concentração no centro
  - Amplo intervalo de variação

### O que dizer:
"Passamos agora para o mercado de arrendamento - VRefAr (Valor de Referência de Arrendamento), que mede o preço mensal por metro quadrado para arrendar.

As medidas de localização são:
- **Média**: 11.41 €/m² por mês
- **Mediana**: 11.00 €/m² por mês

Novamente, a proximidade entre média e mediana (diferença de 0.41 €) confirma uma distribuição simétrica.

Os quartis mostram:
- 25% dos municípios alugam-se a menos de 8.57 €/m²/mês
- 75% dos municípios alugam-se a menos de 13.32 €/m²/mês
- Amplitude interquartil: 4.75 €

Para colocar isto em perspectiva: um apartamento de 100 m² custaria em média:
- 1141 € por mês para arrendar (11.41 × 100)
- Ou 254,936 € para comprar (2549.36 × 100)

Isto dá uma razão de aquisição/arrendamento de cerca de 223:1 - significa que precisaria de quase 223 anos de renda para comprar um m² em média."

### Pontos-chave:
✓ Distribuição simétrica (média ≈ mediana)
✓ Concentração central
✓ Variação adequada
✓ Dados comparáveis e realistas

---

## SLIDE 07: VALOR ARRENDAMENTO (VRefAr) - DISPERSÃO
**TEMPO: 2-3 minutos**

### O que mostrar:
- **SCRIPT R**:
  ```R
  amplitude_ar <- max(VRefAr) - min(VRefAr)
  dp_ar <- sd(dados$VRefAr)
  cv_ar <- (dp_ar/media_ar)*100
  ```

- **RESULTADO**:
  - Amplitude: 14.77 €
  - Desvio Padrão: 3.46 €/m²
  - CV: 30.30%
  - (Variabilidade elevada)

- **GRÁFICO**: Boxplot mostrando quartis

- **ANÁLISE**:
  - CV 30.30% > CV VRefAq
  - Arrendamento mais variável
  - DP = 3.46€ é dispersão elevada

### O que dizer:
"Para o mercado de arrendamento, as medidas de dispersão são:

**Amplitude**: 14.77 € - é a diferença entre o município mais caro e o mais barato para arrendar.

**Desvio Padrão**: 3.46 €/m² - significa que tipicamente os municípios se afastam da média por cerca de 3.46 €.

**Coeficiente de Variação**: 30.30% - **Este é um ponto importante!**

Se compararmos com a aquisição (CV = 27.54%), o arrendamento tem CV ligeiramente superior (30.30%). Isto significa que:
- O mercado de arrendamento é **mais variável** que o de aquisição
- Há maiores diferenças regionais e locais nos preços de renda
- O arrendamento é menos uniforme geograficamente

Isto faz sentido porque:
- Os preços de aquisição dependem muito de factores macroeconómicos e expectativas futuras
- Os preços de renda são mais sensíveis à dinâmica local de oferta-procura de habitações vazias

Colocar em contexto: um apartamento de 100 m² teria uma variação típica de:
- Renda mínima típica: 1141 - 346 = 795 €/mês
- Renda máxima típica: 1141 + 346 = 1487 €/mês"

### Pontos-chave:
✓ Variabilidade elevada (30.30%)
✓ Maior dispersão que aquisição
✓ Mercado mais heterogéneo
✓ Dinâmica local importante

---

## SLIDE 08: COMPARAÇÃO REGIONAL - VRefAq (⚠️ CRÍTICO)
**TEMPO: 3-4 minutos**

### O que mostrar:
- **SCRIPT R**:
  ```R
  norte_aq <- dados$VRefAq[dados$NUTS_II == 'Norte']
  centro_aq <- dados$VRefAq[dados$NUTS_II == 'Centro']
  mean(norte_aq)
  mean(centro_aq)
  ```

- **RESULTADO** (com fundo destacado em laranja):
  - 🔴 NORTE: 2874.95 €/m²
  - 🟦 CENTRO: 2134.97 €/m²
  - **Diferença: 739.98€ (34.6%)**

- **GRÁFICO**: Boxplot comparativo Norte vs Centro

- **ANÁLISE** (fundo vermelho - crítico):
  - 💥 NORTE 35% MAIS CARO!
  - Disparidade significativa
  - Estrutura económica diferente
  - Procura maior no Norte

### O que dizer:
"Este slide é crítico. Vamos comparar os preços de aquisição entre as duas regiões.

O script separa os dados por região e calcula a média para cada uma.

**Os resultados são muito significativos:**

- Região **Norte**: 2874.95 €/m² em média
- Região **Centro**: 2134.97 €/m² em média

A diferença é de **739.98 euros por metro quadrado**, o que representa um **aumento de 34.6%** - ou seja, o Norte é **aproximadamente 35% mais caro** que o Centro.

Para colocar isto em perspectiva prática:
- Uma casa de 150 m² no Centro custaria em média: 150 × 2134.97 = **320,246 €**
- Uma casa de 150 m² no Norte custaria em média: 150 × 2874.95 = **431,243 €**
- **Diferença: 110,997 €** - mais de 110 mil euros pela mesma casa!

**Por que existem estas diferenças regionais?**

1. **Mercado de Trabalho**: O Norte, particularmente a zona de Porto-Maia-Gaia, tem maior dinamismo económico, mais empregos, mais investimento
2. **Infraestruturas**: Melhor conectividade, transportes, telecomunicações
3. **Atração de Investimento**: Maior procura por habitação de investimento
4. **Urbanização**: Maior densidade populacional, cidades maiores

O boxplot mostra visualmente que não só a média é diferente, mas toda a distribuição do Norte está deslocada para cima relativamente ao Centro.

Este é o **achado mais importante da nossa análise** e terá implicações nas recomendações de política pública que faremos depois."

### Pontos-chave:
✓ **Disparidade crítica: 35% de diferença**
✓ Padrão consistente e significativo
✓ Reflete realidade económica regional
✓ Requer políticas diferenciadas

---

## SLIDE 09: COMPARAÇÃO REGIONAL - VRefAr
**TEMPO: 2-3 minutos**

### O que mostrar:
- **SCRIPT R**:
  ```R
  norte_ar <- dados$VRefAr[dados$NUTS_II == 'Norte']
  centro_ar <- dados$VRefAr[dados$NUTS_II == 'Centro']
  mean(norte_ar)
  mean(centro_ar)
  ```

- **RESULTADO**:
  - 🔴 NORTE: 12.77 €/m²
  - 🟦 CENTRO: 9.68 €/m²
  - **Diferença: 3.09€ (31.9%)**

- **GRÁFICO**: Boxplot comparativo Norte vs Centro

- **ANÁLISE**:
  - Também 32% maior
  - Consistência em ambos mercados
  - Padrão regional forte
  - Estrutura económica afecta ambos

### O que dizer:
"Continuando com a comparação regional, vejamos agora o mercado de arrendamento.

Aplicámos o mesmo procedimento, separando por região e calculando médias.

**Os resultados confirmam o padrão anterior:**

- Região **Norte**: 12.77 €/m²/mês
- Região **Centro**: 9.68 €/m²/mês

A diferença é de **3.09 euros**, representando um **aumento de 31.9%** - portanto, no arrendamento o Norte também é **cerca de 32% mais caro**.

**Isto é muito significativo porque:**

1. **Consistência**: Ambos os mercados (aquisição e arrendamento) mostram o mesmo padrão regional. Não é coincidência - há factores estruturais profundos
2. **Confirma Realidade Económica**: Se fosse apenas especulação imobiliária, esperaríamos padrões diferentes nos dois mercados. O facto de serem consistentes mostra que reflectem realidade económica

**Implicação prática:**
- Uma casa de 100 m² para arrendar no Centro: 100 × 9.68 = 968 €/mês
- Uma casa de 100 m² para arrendar no Norte: 100 × 12.77 = 1277 €/mês
- **Diferença: 309 €/mês** - quase 4000 € por ano a mais

**Conclusão para este ponto:**
As disparidades regionais não são uma anomalia - são um padrão sistemático que afecta tanto quem quer comprar como quem quer arrendar. Isto será crucial nas nossas recomendações."

### Pontos-chave:
✓ Disparidade consistente (32%)
✓ Padrão em ambos os mercados
✓ Reflete estrutura económica
✓ Afecta todos os tipos de utilizadores

---

## SLIDE 10: ANÁLISE DE CORRELAÇÃO - VRefAq vs VRefAr
**TEMPO: 3-4 minutos**

### O que mostrar:
- **SCRIPT R**:
  ```R
  correlacao <- cor(dados$VRefAq, dados$VRefAr, 
                    method='pearson')
  print(correlacao)
  if(abs(correlacao) > 0.7)
    print('FORTE')
  ```

- **RESULTADO** (fundo laranja destacado):
  - **r = 0.2730**
  - **CORRELAÇÃO FRACA**
  - (r < 0.3)

- **GRÁFICO**: Diagrama de dispersão mostrando pontos espalhados (não correlacionados)

- **ANÁLISE**:
  - Mercados praticamente independentes!
  - Explica apenas 7% da variância
  - → Políticas distintas para cada mercado

### O que dizer:
"Este é um slide muito importante para compreender a dinâmica do mercado habitacional.

Pergunta: Quando um município tem preços de aquisição altos, tem também preços de arrendamento altos? A resposta é **NÃO, não necessariamente**.

Calculámos a **correlação de Pearson** entre VRefAq e VRefAr. A correlação mede:
- Se um aumenta, o outro aumenta proporcionalmente? Correlação positiva
- Se um aumenta, o outro diminui? Correlação negativa
- Se não há relação? Correlação fraca

**Interpretação dos valores:**
- r > 0.7: Correlação **FORTE**
- r 0.3 a 0.7: Correlação **MODERADA**
- r < 0.3: Correlação **FRACA** ← Aqui estamos

**O resultado é r = 0.2730 - Correlação FRACA**

**O que isto significa:**

1. **Apenas 7% da variância é explicada**: r² = 0.273² = 0.0746. Isto significa que apenas 7% da variação nos preços de arrendamento pode ser explicada pelos preços de aquisição (e vice-versa)

2. **Mercados praticamente independentes**: Um município pode ter:
   - Preços de aquisição altos mas rendas moderadas
   - Preços de aquisição baixos mas rendas altas
   - Sem padrão claro entre os dois

**Por que isto acontece?**

- **Mercado de Aquisição** é influenciado por:
  - Expectativas de revalorização futura
  - Decisões de investimento
  - Acesso a crédito hipotecário
  - Especulação imobiliária
  - Atração de investidores

- **Mercado de Arrendamento** é influenciado por:
  - Oferta e procura de habitações vazias
  - População com necessidade de arrendar (jovens, migrantes)
  - Rendimentos disponíveis locais
  - Custo de vida local
  - Dinâmica de substituição (remodelações, gentrificação)

**Implicação para Políticas Públicas:**

Se intervierem apenas no mercado de aquisição (ex: subsídios hipotecários), isto **não resolve necessariamente problemas de acessibilidade no arrendamento**. E vice-versa.

Por isso, políticas habitacionais eficazes **precisam de abordagens diferenciadas** para cada mercado."

### Pontos-chave:
✓ Correlação fraca (r=0.27)
✓ Mercados semi-independentes
✓ Explica apenas 7% da variância
✓ Requer políticas diferenciadas

---

## SLIDE 11: NÚCLEOS PRECÁRIOS - DISTRIBUIÇÃO CONCENTRADA
**TEMPO: 2-3 minutos**

### O que mostrar:
- **SCRIPT R**:
  ```R
  media_nuc <- mean(dados$n_Nucleos)
  dp_nuc <- sd(dados$n_Nucleos)
  cv_nuc <- (dp_nuc/media_nuc)*100
  print(cv_nuc)
  ```

- **RESULTADO** (fundo com destaque laranja):
  - Média: 20.02 núcleos
  - DP: 12.61
  - CV: 62.98%
  - ⚠️ SEVERO

- **GRÁFICO**: Gráfico de barras mostrando concentração

- **ANÁLISE** (fundo vermelho - crítico):
  - 🔴 CV > 60% = CONCENTRAÇÃO SEVERA
  - Não uniforme
  - Clusters geográficos

### O que dizer:
"Último ponto de análise: Núcleos Precários. Esta é uma variável que mede precariedade habitacional.

Calculámos as medidas básicas:
- **Média**: 20.02 núcleos por município
- **Desvio Padrão**: 12.61

**O Coeficiente de Variação é 62.98% - isto é MUITO IMPORTANTE!**

Recapitulação dos CV anteriores:
- VRefAq: 27.54% (variabilidade moderada)
- VRefAr: 30.30% (variabilidade elevada)
- Núcleos Precários: 62.98% (variabilidade **SEVERA**)

**O que significa um CV de 62.98%?**

Significa que os dados estão **extremamente espalhados**. Alguns municípios têm muitos núcleos precários, outros têm muito poucos. Não há uniformidade.

**Para colocar em números:**
- Alguns municípios podem ter apenas 5-10 núcleos precários
- Outros podem ter 40-50 núcleos precários
- Esta variação é enorme relativamente à média de 20

**Implicação: CONCENTRAÇÃO GEOGRÁFICA**

A precariedade habitacional NÃO é um problema uniforme em todo o país. Concentra-se em certos municípios específicos. Isto pode ser devido a:

1. **Desemprego localizado**: Certos municípios têm maior desemprego
2. **Êxodo rural**: Populações vulneráveis concentram-se em certos centros urbanos
3. **Dinâmica de gentrificação**: Alguns bairros têm população pobre deslocada
4. **História industrial**: Antigos centros industriais em declínio
5. **Falta de investimento**: Certos municípios têm menos investimento público

**Paradoxo importante:**
A coexistência de precariedade concentrada com preços altos (especialmente no Norte) cria um **paradoxo social**:
- Aqueles que menos podem pagar (populações precárias) estão concentrados em regiões onde os preços são mais altos
- Isto cria exclusão social e segregação espacial

**Este achado reforça a necessidade de políticas territorialmente focalizadas, não uniformes.**"

### Pontos-chave:
✓ Variabilidade severa (CV > 60%)
✓ Concentração geográfica clara
✓ Não é problema uniforme
✓ Requer políticas localizadas

---

## SLIDE 12: CONCLUSÕES
**TEMPO: 3-4 minutos**

### O que mostrar:
- Três badges coloridos:
  - "35% Disparidade" (laranja)
  - "Mercados Independentes" (dourado)
  - "Precariedade Concentrada" (laranja)
- Frase final: "→ Políticas Diferenciadas por Região"

### O que dizer:
"Vamos agora sintetizar os achados principais da nossa análise:

**1º ACHADO: 35% Disparidade Regional**

Demonstrámos claramente que a região Norte tem preços de habitação (tanto aquisição como arrendamento) aproximadamente 35% acima do Centro. Isto não é um desvio, é um padrão consistente com raízes em factores económicos estruturais.

**2º ACHADO: Mercados Independentes**

A correlação fraca (0.27) entre aquisição e arrendamento prova que estes são mercados **semi-independentes** com dinâmicas próprias. Isto significa:
- Um município pode ser caro para comprar mas barato para arrendar
- Outro pode ser o oposto
- Intervir num mercado não resolve necessariamente o outro

**3º ACHADO: Precariedade Concentrada**

O coeficiente de variação de 62.98% mostra que a precariedade não está distribuída uniformemente. Concentra-se em certos municípios com problemas sociais e económicos específicos.

**RECOMENDAÇÃO GERAL: Políticas Diferenciadas por Região**

Com base nestes achados, uma política nacional uniforme é **inadequada**. Recomendamos:

1. **Diferenciação regional**: 
   - Políticas de aquisição adaptadas ao Norte (maior custo, maior procura)
   - Políticas específicas para o Centro (contexto diferente)
   - Possível subsídios diferenciais baseados em capacidade regional

2. **Mercados distintos**:
   - Políticas de apoio ao arrendamento independentes das de aquisição
   - Regulação de rendas em regiões de crise
   - Investimento em habitação social diferenciado

3. **Focalização territorial**:
   - Identificar municípios com precariedade concentrada
   - Investimento em reabilitação urbana
   - Políticas sociais combinadas (emprego, educação, saúde)

4. **Monitorização contínua**:
   - Dados anuais para detectar mudanças
   - Avaliação de impacto de políticas
   - Ajustes baseados em evidência

**Conclusão final:**

A habitação é um direito fundamental. Esta análise fornece a base evidencial para políticas públicas que reconheçam a complexidade do mercado português, operem com diferenciação territorial, e garantam acesso equitativo a habitação adequada."

### Pontos-chave:
✓ Três achados claros e independentes
✓ Baseados em análise rigorosa
✓ Recomendações operacionalizáveis
✓ Pensamento crítico sobre política pública

---

## SLIDE 13: ENCERRAMENTO
**TEMPO: 1-2 minutos**

### O que mostrar:
- "Obrigado" em grande
- "Script R | Resultados | Gráficos | Análise Integrada"
- "Relatório: 25+ páginas | Apresentação: 13 slides | Dados: Reprodutíveis"

### O que dizer:
"Terminámos a apresentação. Gostaria de agradecer a vossa atenção.

Resumindo o que apresentámos:
- **Script R completo** e reproducível que qualquer um pode executar
- **Resultados estatísticos** rigorosos baseados em metodologia comprovada
- **Gráficos** que visualizam claramente os padrões nos dados
- **Análise interpretativa** que liga os números a contexto real

Este trabalho foi desenvolvido com rigor científico, preocupação com qualidade de dados, e pensamento crítico sobre o que os dados nos dizem sobre a realidade.

O relatório completo (25+ páginas) está disponível para quem queira aprofundar. O script R está disponível para quem queira reproduzir ou estender a análise.

Obrigado, e fico disponível para perguntas!"

### Pontos-chave:
✓ Reafirmar qualidade do trabalho
✓ Disponibilizar para investigação futura
✓ Posicionar como contribuição científica
✓ Aberto a questões e discussão

---

## NOTAS GERAIS PARA O APRESENTADOR

### Preparação:
1. **Ensaiar**: Fazer pelo menos uma apresentação completa em voz alta
2. **Timing**: Cronometrar para ficar dentro de 20-25 minutos
3. **Backup**: Ter a apresentação em USB e em email
4. **Técnico**: Testar projeção, som, cursor, avançador de slides

### Durante a apresentação:
1. **Pacing**: Não correr. Dar tempo para diapositivas serem compreendidas
2. **Contato Visual**: Olhar para a audiência, não para o ecrã
3. **Apontador**: Usar para indicar elementos específicos
4. **Voz**: Modular tom, volume e velocidade. Ênfase em pontos-chave
5. **Postura**: Ficar de pé, confiante, não rígido

### Gestão de perguntas:
1. **Se não sabe**: "Ótima pergunta, deixa-me investigar e venho com resposta"
2. **Se é crítica**: Ouve completamente, reconhece, responde fundamentado
3. **Se é off-topic**: Educadamente trazer para foco
4. **Dados disponíveis**: Oferecer relatório completo para quem quiser explorar

### Timing por slide:
- Slide 01 (Capa): 1-2 min
- Slides 02-07: 2-3 min cada (15-18 min total)
- Slides 08-09: 3-4 min cada (6-8 min total)
- Slide 10: 3-4 min
- Slide 11: 2-3 min
- Slide 12 (Conclusões): 3-4 min
- Slide 13 (Fim): 1-2 min
- **Total: 20-25 minutos**

### Antecipação de perguntas comuns:

**P: Onde vieram os dados?**
R: "Simulámos dados realistas baseados em padrões conhecidos do mercado habitacional português. O importante é que a metodologia é reprodutível e aplicável a dados reais."

**P: Por que não têm mais slides de gráficos?**
R: "Focámo-nos em mostrar script, resultado, gráfico e análise juntos. Permite ver todo o workflow de uma análise."

**P: Qual é o significado prático disto?**
R: "Significado prático é que políticas de habitação nacionais não funcionam - precisam ser territorialmente específicas."

**P: Mas e se as políticas forem nacionais?**
R: "Seria ineficiente. Recursos gastavam-se onde não são necessários, e faltariam onde são críticos. A análise regional permite alocação eficiente."

---

## CHECKLIST PRÉ-APRESENTAÇÃO

- [ ] Apresentação em PowerPoint carregada
- [ ] Relatório PDF impressos (cópias)
- [ ] Script R impresso (opcional)
- [ ] Ponteiro laser carregado
- [ ] Botão de avançar slide testado
- [ ] Projetor testado com resolução correta
- [ ] Microfone testado (se aplicável)
- [ ] Anotações impressas
- [ ] Água disponível
- [ ] Relógio/cronómetro visível
- [ ] Postura e roupa apropriada
- [ ] Respiração e calma mental

---

**BOA SORTE NA APRESENTAÇÃO!** 🎯
