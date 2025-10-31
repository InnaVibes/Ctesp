# Relatório M1 - Pet Finder App

## 1. Visão do Produto

O Pet Finder é uma aplicação iOS que permite aos utilizadores descobrir e seguir animais disponíveis para adoção através da API Petfinder. A aplicação oferece uma experiência intuitiva para explorar animais, receber notificações diárias e manter uma lista personalizada de animais favoritos.

## 2. Análise do Problema

### 2.1 Desafios Identificados
- Integração com API externa (Petfinder)
- Gestão eficiente de cache para minimizar consumo de dados
- Sistema de notificações configurável
- Persistência de dados local (Core Data)
- Interface responsiva para múltiplos dispositivos

### 2.2 Soluções Propostas
- Arquitetura MVC com camada de serviços
- Cache com expiração configurável
- NotificationService para gestão centralizada
- Core Data para persistência offline
- Auto Layout para adaptação de ecrãs

## 3. Requisitos do Projeto

### 3.1 Requisitos Obrigatórios
- [x] Suporte iPhone e iPad
- [x] UITableView/UICollectionView
- [x] Core Data
- [x] Operações assíncronas
- [x] Notificações
- [x] Human Interface Guidelines
- [ ] API Petfinder (M2)
- [ ] Sensores (M2)

### 3.2 Requisitos de Bonificação Previstos
- Sistema de Achievements
- Proximidade (GPS)
- Partilha social
- Web services adicionais

## 4. Funcionalidades de Bonificação

### Sistema de Achievements
- Primeiro animal seguido
- 5, 10, 20 animais seguidos
- Explorador (10 visualizações)
- Visitante diário (7 dias)

### Proximidade
- Usar GPS para encontrar animais próximos
- Filtrar por distância
- Mapa com localização

### Partilha Social
- Facebook, Instagram, Twitter
- UIActivityViewController
- Mensagem personalizada

## 5. Mockups das Interfaces

### 5.1 Tab Bar (4 Tabs)
```
┌─────────────────────────────────┐
│  ❤️ Animais │ ⭐ Seguindo │ 🏆 Conquistas │ ⚙️ Definições
└─────────────────────────────────┘
```

### 5.2 Lista de Animais
```
┌─────────────────────────┐
│ ← Animais para Adoção   │
├─────────────────────────┤
│ 🔍 Pesquisar...     🎛️  │
├─────────────────────────┤
│ ┌───┐                   │
│ │IMG│ Rex - Cão         │
│ │   │ Labrador, Lisboa  │
│ └───┘              ❤️  │
├─────────────────────────┤
│ ┌───┐                   │
│ │IMG│ Luna - Gato       │
│ │   │ Persa, Porto      │
│ └───┘              ❤️  │
└─────────────────────────┘
```

### 5.3 Detalhe do Animal
```
┌─────────────────────────┐
│ ← Rex                   │
├─────────────────────────┤
│ ┌───────────────────┐   │
│ │     GALERIA       │   │
│ │  ←  [FOTO]  →     │   │
│ └───────────────────┘   │
├─────────────────────────┤
│ 🐕 Cão • Labrador      │
│ ♂️ Macho • Adulto      │
│ 📍 Lisboa, Portugal    │
├─────────────────────────┤
│ Descrição:             │
│ Rex é um cão amigável  │
│ e brincalhão...        │
├─────────────────────────┤
│ [❤️ Seguir] [📤 Partilhar]│
│ [🎲 Animal Aleatório]    │
└─────────────────────────┘
```

### 5.4 Definições
```
┌─────────────────────────┐
│ Definições              │
├─────────────────────────┤
│ CACHE                   │
│ Expiração (min)    60 > │
│ Items por página   20 > │
├─────────────────────────┤
│ NOTIFICAÇÕES            │
│ Diárias            ✓   │
│ Hora               09:00>│
├─────────────────────────┤
│ GERAL                   │
│ Limpar Dados        🗑️  │
└─────────────────────────┘
```

### 5.5 Conquistas
```
┌─────────────────────────┐
│ Conquistas              │
├─────────────────────────┤
│ ┌───┐ ┌───┐ ┌───┐      │
│ │⭐ │ │🔒│ │🔒│      │
│ │1º │ │5  │ │10 │      │
│ └───┘ └───┘ └───┘      │
│ ┌───┐ ┌───┐ ┌───┐      │
│ │🔒│ │🔒│ │🔒│      │
│ │20 │ │👁️ │ │📅│      │
│ └───┘ └───┘ └───┘      │
└─────────────────────────┘
```

## 6. Implementação M1

### 6.1 Navegação
- UITabBarController com 4 tabs
- UINavigationController em cada tab
- Large Titles ativado
- Safe Area respeitada

### 6.2 Definições
Todas as opções implementadas:
- Cache expiration time (UserDefaults)
- Items per page (UserDefaults)
- Notificações (toggle + hora)
- Limpar dados (ação)

### 6.3 Core Data
Modelo AnimalEntity criado com:
- id, name, species, breed
- gender, age, description
- photoURLs (JSON), location (JSON)
- isFollowing, savedDate

### 6.4 Notificações
NotificationService implementado:
- Agendamento diário
- Configuração de hora
- Cancelamento

## 7. Arquitetura

```
┌──────────────────────┐
│   ViewControllers    │
│  (UI Layer - MVC)    │
├──────────────────────┤
│   Services Layer     │
│  - NotificationService│
│  - (PetFinderService)│
│  - (CacheService)    │
├──────────────────────┤
│   Data Layer         │
│  - Core Data         │
│  - UserDefaults      │
└──────────────────────┘
```

## 8. Tecnologias Utilizadas

- **Linguagem:** Swift 5+
- **IDE:** Xcode 15+
- **UI:** UIKit
- **Persistência:** Core Data
- **Notificações:** UserNotifications
- **Layout:** Auto Layout

## 9. Próximos Passos (M2)

### Implementação Completa:
1. PetFinderService (API OAuth 2.0)
2. CacheService (File System)
3. SensorService (GPS, Acelerómetro)
4. AchievementService (Sistema de conquistas)
5. CoreDataManager (CRUD operations)
6. Completar todos os ViewControllers
7. Custom Cells (AnimalTableViewCell, PhotoCell)
8. FilterViewController
9. Galeria de fotos
10. Partilha social

### Funcionalidades M2:
- Listagem completa de animais
- Paginação infinita
- Filtros avançados
- Detalhe com galeria
- Following list funcional
- Cache com expiração
- Achievements desbloqueáveis
- Sensores integrados

## 10. Conclusões M1

### Alcançado:
✅ Estrutura base da aplicação
✅ Navegação completa (4 tabs)
✅ Definições funcionais
✅ Core Data configurado
✅ Sistema de notificações
✅ Arquitetura MVC clara

### Aprendizagens:
- Configuração de projetos iOS
- TabBar e NavigationController
- UserDefaults para configurações
- Core Data modeling
- UserNotifications framework
- Human Interface Guidelines

### Próximo Milestone:
- Integração com API Petfinder
- Implementação completa de funcionalidades
- Cache e sensores
- Polimento da UI

---

**Versão:** M1 - Inicial  
**Data:** Novembro 2025  
**Peso:** 40% da nota final
