# Instruções de Entrega - Milestones M1 e M2

## 📦 Preparação para Entrega

### ✅ Checklist Pré-Entrega

**Antes de submeter:**
- [ ] Código compila sem erros
- [ ] Sem warnings (ou warnings justificados)
- [ ] Todos os ficheiros em Git
- [ ] README.md actualizado
- [ ] Relatório completo
- [ ] API Keys não são públicas
- [ ] Funcionalidades testadas

---

## 🏁 MILESTONE M1 (40%)

### Entrega: 03 de Novembro de 2025
### Defesa: 05 de Novembro de 2025

### Requisitos M1

#### 1. Relatório Inicial
- [x] **Visão do Produto**: Descrição clara do objetivo
- [x] **Análise do Problema**: Identificar desafios e soluções
- [x] **Requisitos do Projeto**: Lista obrigatórios e bonificação
- [x] **Funcionalidades de Bonificação**: O que será implementado
- [x] **Mockups das Interfaces**: Protótipos visuais

#### 2. Versão Inicial da App
- [x] **App Icon**: Criado e definido
- [x] **Launch Screen**: LaunchScreen.storyboard configurado
- [x] **Navegação**: TabBarController com 4 abas
  - [x] Animais
  - [x] Seguindo
  - [x] Conquistas
  - [x] Definições
- [x] **Definições**: Screen com configurações
  - [x] Cache expiration time
  - [x] Items per page
  - [x] Notification hour
  - [x] Clear all data
- [x] **Core Data**: Configurado e model definido
  - [x] AnimalEntity
  - [x] Atributos corretos
- [x] **Notificações**: Sistema de notificações local
  - [x] Agendar notificações diárias
  - [x] Cancelar notificações
  - [x] Permissões

### Checklist M1

```
Relatório:
- [ ] Documento bem estruturado (20 páginas mínimo)
- [ ] Visão clara do produto
- [ ] Análise de requisitos
- [ ] Mockups profissionais (Figma, XD, paper)
- [ ] Funcionalidades de bonificação documentadas
- [ ] Screenshots das interfaces UI

App:
- [ ] Projeto Xcode compilável
- [ ] 4 tabs funcionais
- [ ] Settings com todas as opções
- [ ] Core Data model correto
- [ ] Notificações agendadas
- [ ] Sem crashes
- [ ] Sem warnings importantes

Git:
- [ ] Repositório público (com docentes como reporters)
- [ ] .gitignore correcto
- [ ] Commits meaningful
- [ ] README actualizado
- [ ] Todos os ficheiros sincronizados
```

### Submissão M1

1. **GitLab**:
```bash
cd PetFinderApp
git add .
git commit -m "M1: Versão inicial da aplicação"
git tag -a M1 -m "Milestone 1 - Versão Inicial"
git push origin main
git push origin M1
```

2. **Relatório em PDF**:
   - Nome: `Relatório_M1_PetFinderApp.pdf`
   - Formato: A4, fonte 11pt
   - Incluir: Índice, introdução, desenvolvimento, conclusão
   - Anexar: Mockups, diagramas, screenshots

3. **Submissão Moodle**:
   - Ficheiro: `Relatório_M1_PetFinderApp.pdf`
   - URL GitLab: Link do repositório
   - Até: Domingo 02 de Novembro 23:59
   - **Defesa**: 05 de Novembro (durante aula)

### Apresentação M1 (5-10 minutos)

**Estrutura**:
1. Visão geral do projeto (1 min)
2. Arquitetura e tecnologias (2 min)
3. Demo das funcionalidades (3-5 min)
4. Dificuldades encontradas (1 min)
5. Plano para M2 (1 min)

---

## 🎉 MILESTONE M2 (60%)

### Entrega: 04 de Janeiro de 2026
### Defesa: 08 de Janeiro de 2026

### Requisitos M2

#### 1. Relatório Final
- [x] **Detalhes de Implementação**: Explicar decisões técnicas
- [x] **Descrição Funcionalidades**: Todas obrigatórias
- [x] **Descrição Bonificação**: Tudo implementado
- [x] **Testes e Resultados**: Evidências de funcionamento
- [x] **Conclusões**: Aprendizagens e futuro

#### 2. Versão Final da App
- [x] **Todas as Funcionalidades Obrigatórias**:
  - [x] Lista de animais (paginação)
  - [x] Filtros (espécie, raça, género, idade)
  - [x] Detalhe do animal (galeria, info completa)
  - [x] Cache com expiração
  - [x] API Petfinder integrada
  - [x] Core Data funcional
  - [x] Notificações diárias
  - [x] Threading/GCD
  - [x] Sensores
  - [x] Multi-screen support

- [x] **Funcionalidades de Bonificação**:
  - [x] Achievements/Conquistas
  - [x] Proximity detection (GPS)
  - [x] Social share
  - [x] UI bem polido

### Checklist M2

```
Relatório:
- [ ] Documento completo (40+ páginas)
- [ ] Detalhes técnicos explicados
- [ ] Código fonte referenciado
- [ ] Screenshots e videos
- [ ] Testes realizados documentados
- [ ] Análise de performance
- [ ] Conclusões e aprendizagens
- [ ] Possíveis melhorias futuras

App:
- [ ] 100% das funcionalidades obrigatórias
- [ ] Bonificações implementadas
- [ ] Sem crashes em teste
- [ ] Performance aceitável
- [ ] Interface polida e intuitiva
- [ ] Mensagens de erro úteis
- [ ] Código bem documentado
- [ ] Testes incluídos (sugerido)

Qualidade:
- [ ] Código limpo (sem warnings)
- [ ] Arquitectura clara (MVC)
- [ ] Responsabilidade única por classe
- [ ] Nomes descritivos
- [ ] Comentários explicativos
- [ ] Tratamento de erros

Git:
- [ ] Histórico de commits completo
- [ ] Branches bem organizados
- [ ] Documentação actualizada
- [ ] Release notes
- [ ] Todos os ficheiros sincronizados
```

### Submissão M2

1. **GitLab**:
```bash
cd PetFinderApp
git add .
git commit -m "M2: Versão final da aplicação"
git tag -a M2 -m "Milestone 2 - Versão Final"
git push origin main
git push origin M2
```

2. **Relatório em PDF**:
   - Nome: `Relatório_M2_PetFinderApp.pdf`
   - Incluir relatório M1 completo + atualizações M2
   - Mínimo 40 páginas
   - Incluir: Testes, screenshots finais, benchmarks

3. **Vídeo de Demonstração** (opcional mas recomendado):
   - Duração: 5-10 minutos
   - Mostrar todas as funcionalidades
   - Gravação de ecrã (QuickTime no Mac)
   - Formato: MP4 ou MOV

4. **Submissão Moodle**:
   - Ficheiro: `Relatório_M2_PetFinderApp.pdf`
   - Ficheiro (opcional): `Demo_M2.mp4`
   - URL GitLab: Link do repositório
   - Até: Domingo 03 de Janeiro 23:59
   - **Defesa**: 08 de Janeiro (durante aula)

### Apresentação M2 (10-15 minutos)

**Estrutura**:
1. Evolução desde M1 (1 min)
2. Funcionalidades obrigatórias (4 min)
3. Funcionalidades de bonificação (3 min)
4. Demo completa (4-5 min)
5. Dificuldades e soluções (1 min)
6. Testes e qualidade (1 min)

---

## 📋 Documentação Necessária

### Para M1 e M2:
- [x] README.md (instruções de instalação)
- [x] GITLAB_SETUP.md (configuração Git)
- [x] TECHNICAL_DOCUMENTATION.md (detalhes implementação)
- [x] Comentários no código Swift
- [x] Mockups/protótipos

### Relatório Sugerido (Índice)

```
1. Introdução
   1.1 Tema
   1.2 Objetivos
   1.3 Contexto (UC PDM II)

2. Análise e Especificação
   2.1 Descrição do Problema
   2.2 Requisitos Obrigatórios
   2.3 Requisitos de Bonificação
   2.4 Mockups de Interfaces

3. Arquitetura e Design
   3.1 Arquitetura (MVC)
   3.2 Estrutura de Ficheiros
   3.3 Fluxo de Dados
   3.4 Padrões Utilizados

4. Implementação
   4.1 Tecnologias Utilizadas
   4.2 ViewControllers
   4.3 Services/Managers
   4.4 Core Data
   4.5 API Integration
   4.6 Notificações
   4.7 Sensores

5. Testes e Validação
   5.1 Casos de Teste
   5.2 Resultados
   5.3 Performance
   5.4 Qualidade de Código

6. Conclusões
   6.1 Aprendizagens
   6.2 Desafios
   6.3 Melhorias Futuras
   6.4 Reflexão Pessoal

7. Referências

ANEXOS:
- Screenshots finais
- Código fonte (principais ficheiros)
- Diagramas
- Videos (se disponível)
```

---

## ⚠️ Pontos Importantes

### Código
- Não incluir API Keys em público
- Comentar código complexo
- Usar nomes descritivos
- Seguir Swift style guide

### Relatório
- Ser claro e conciso
- Incluir evidências (screenshots)
- Explicar decisões técnicas
- Justificar escolhas

### Apresentação
- Preparar bem
- Conhecer o código
- Ter respostas para perguntas técnicas
- Demonstrar funcionamento real

### Git
- Commits significativos
- Branch strategy clara
- README atualizado
- Acesso aos docentes

---

## 🤝 Avaliação pelos Pares

Cada grupo deve:
1. Analisar contribuição de cada membro
2. Avaliar desempenho individual
3. Submeter análise com relatório
4. Serão considerados na nota final (5%)

---

## 📞 Contacto

**Dúvidas sobre entrega:**
- Email: cfpa@estq.ipp.pt ou jmt@estq.ipp.pt
- Aulas de PDM II
- Horário de atendimento

**GitLab Issues**:
- Usar para documentar bugs conhecidos
- Facilita o entendimento da evolução

---

## 🎯 Critérios de Sucesso

### M1
- ✅ App compilável
- ✅ Navegação funcional
- ✅ Settings funcionam
- ✅ Core Data configurado
- ✅ Relatório claro

### M2
- ✅ 100% funcionalidades obrigatórias
- ✅ Bonificações implementadas
- ✅ App polida e profissional
- ✅ Sem crashes significativos
- ✅ Relatório completo e detalhado

---

**Sucesso na entrega!** 🚀

*Última atualização: Outubro 2025*
