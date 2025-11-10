# Pet Finder App - Manifest de Ficheiros

## 📦 Estrutura Completa do Projeto

```
PetFinderApp/
│
├── 📄 App Lifecycle & Core
│   ├── AppDelegate.swift
│   │   - Configuração inicial da app
│   │   - Setup de Core Data
│   │   - Permissões de notificações
│   │   - Ciclo de vida UIApplication
│   │
│   └── SceneDelegate.swift
│       - Gerenciamento de scenes (iOS 13+)
│       - Eventos de foreground/background
│       - Persistência ao sair da app
│
├── 📊 Data Models
│   ├── Animal.swift
│   │   - Struct Animal (Codable)
│   │   - Struct Location (Codable)
│   │   - Struct Photo (Codable)
│   │   - Struct PetFinderResponse (API)
│   │   - Struct Pagination (API)
│   │   - Class AnimalEntity (Core Data)
│   │   - Extensões para conversão
│   │
│   └── PetFinderDataModel.xcdatamodel
│       - Modelo Core Data XML
│       - Entidade AnimalEntity
│       - Atributos e tipos
│
├── 🌐 Services (Networking & Data)
│   ├── PetFinderService.swift
│   │   - Autenticação OAuth 2.0
│   │   - fetchAnimals()
│   │   - fetchAnimalDetail()
│   │   - fetchRandomAnimal()
│   │   - Handling de erros
│   │
│   ├── CacheService.swift
│   │   - Persistência de ficheiros
│   │   - Expiração configurável
│   │   - Limpeza automática
│   │   - JSON encode/decode
│   │
│   ├── NotificationService.swift
│   │   - Notificações locais
│   │   - Agendamento diário
│   │   - Notificações imediatas
│   │   - Cancelamento
│   │
│   ├── SensorService.swift
│   │   - Acelerómetro
│   │   - Giroscópio
│   │   - Localização (GPS)
│   │   - Sensor de proximidade
│   │   - CLLocationManagerDelegate
│   │
│   ├── AchievementService.swift
│   │   - Struct Achievement
│   │   - 6 Conquistas predefinidas
│   │   - Desbloqueio automático
│   │   - Tracking de progresso
│   │   - Notificações de desbloqueio
│   │
│   └── CoreDataManager.swift
│       - Singleton para Core Data
│       - CRUD operations
│       - Fetch requests
│       - Following list management
│
├── 🎨 View Controllers - Main Tabs
│   ├── AnimalListViewController.swift
│       - UITableView com lista de animais
│       - Paginação infinita
│       - Filtros e pesquisa
│       - Pull to refresh
│       - Delegate para filtros
│
│   ├── FollowingViewController.swift
│       - UITableView com animais seguidos
│       - Carregamento de Core Data
│       - Ações de remoção
│       - Navegação para detalhe
│
│   ├── AchievementsViewController.swift
│       - UICollectionView com grid
│       - Células customizadas
│       - Visual locked/unlocked
│       - Apresentação de ícones
│
│   └── SettingsViewController.swift
│       - UITableView grouped
│       - Configurações de cache
│       - Configurações de notificações
│       - Limpeza de dados
│       - Custom cells (SwitchTableViewCell)
│
├── 🎯 Supporting View Controllers
│   ├── AnimalDetailViewController.swift
│       - Detalhe completo do animal
│       - UIScrollView com conteúdo
│       - UICollectionView horizontal de fotos
│       - Botões: Seguir, Partilhar, Aleatório
│       - Galeria de imagens
│
│   └── FilterViewController.swift
│       - Filtros por espécie, raça, género, idade
│       - Protocol delegate para aplicar filtros
│       - UITableView com opções
│       - Checkmarks de seleção
│
├── 🎪 Custom Cells & Components
│   ├── AnimalTableViewCell.swift
│       - Célula customizada
│       - Foto, nome, espécie, localização
│       - Botão de seguir
│       - Layout com constraints
│
│   ├── PhotoCollectionViewCell.swift
│       - Célula de foto
│       - Download assincro
│       - Carregamento de URLs
│
│   └── SwitchTableViewCell.swift
│       - Célula com toggle
│       - UISwitch
│       - Ações customizadas
│
├── ⚙️ Configuration Files
│   ├── Info.plist
│   │   - Permissões de localização
│   │   - Permissões de câmara
│   │   - Permissões de notificações
│   │   - Display name
│   │   - Bundle identifier
│   │   - Deployment target
│   │
│   └── PetFinderDataModel.xcdatamodel
│       - Modelo entidade AnimalEntity
│       - Atributos de armazenamento
│
├── 📚 Documentation
│   ├── README.md
│   │   - Visão geral do projeto
│   │   - Funcionalidades principais
│   │   - Estrutura do projeto
│   │   - Instruções de setup
│   │   - Tecnologias utilizadas
│   │   - Permissões necessárias
│   │   - Documentação das funcionalidades
│   │
│   ├── GITLAB_SETUP.md
│   │   - Instruções de GitLab
│   │   - Configuração de repositório
│   │   - Branching strategy
│   │   - Convenções de commit
│   │   - Workflow recomendado
│   │   - Proteção de dados sensíveis
│   │   - Colaboração em grupo
│   │
│   ├── TECHNICAL_DOCUMENTATION.md
│   │   - Arquitetura do projeto
│   │   - Fluxo de dados
│   │   - Segurança
│   │   - Performance
│   │   - Integração API
│   │   - Threading
│   │   - Testes
│   │   - Suporte a dispositivos
│   │   - Otimização de bateria
│   │
│   ├── PROJECT_SUMMARY.md
│   │   - Sumário executivo
│   │   - Conformidade com requisitos
│   │   - Quick start
│   │   - Estatísticas
│   │   - Roadmap futuro
│   │   - Objetivos alcançados
│   │
│   └── FILES_MANIFEST.md (este ficheiro)
│       - Descrição de todos os ficheiros
│       - Estrutura e organização
│       - Responsabilidades
│
└── 📋 Total: 25+ ficheiros Swift, plist, xml, markdown

```

## 📊 Contagem de Ficheiros

| Tipo | Quantidade | Ficheiros |
|------|-----------|-----------|
| Swift (Controllers) | 6 | *ViewController.swift |
| Swift (Services) | 6 | *Service.swift |
| Swift (Models) | 2 | Animal.swift, App Delegates |
| Swift (Cells) | 3 | *Cell.swift |
| Swift (Utilities) | 1 | CoreDataManager.swift |
| Configuration | 2 | Info.plist, xcdatamodel |
| Documentation | 5 | .md files |
| **TOTAL** | **25+** | |

## 🔗 Dependências entre Ficheiros

```
AppDelegate.swift
    ├── CoreDataManager.swift
    ├── PetFinderService.swift
    ├── NotificationService.swift
    └── UIViewController (todas as tabs)

AnimalListViewController.swift
    ├── Animal.swift (Struct)
    ├── PetFinderService.swift
    ├── CacheService.swift
    ├── AnimalTableViewCell.swift
    ├── AnimalDetailViewController.swift
    └── FilterViewController.swift

AnimalDetailViewController.swift
    ├── Animal.swift
    ├── PhotoCollectionViewCell.swift
    ├── NotificationService.swift
    ├── AchievementService.swift
    ├── PetFinderService.swift
    └── CoreDataManager.swift

FollowingViewController.swift
    ├── Animal.swift
    ├── CoreDataManager.swift
    ├── AnimalTableViewCell.swift
    └── AnimalDetailViewController.swift

AchievementsViewController.swift
    ├── AchievementService.swift
    └── AchievementCollectionViewCell.swift

SettingsViewController.swift
    ├── UserDefaults (via NotificationService)
    ├── CacheService.swift
    ├── NotificationService.swift
    ├── CoreDataManager.swift
    └── SwitchTableViewCell.swift

CoreDataManager.swift
    ├── Animal.swift
    └── AnimalEntity (via PetFinderDataModel)

PetFinderService.swift
    ├── Animal.swift
    └── URLSession (Apple)

CacheService.swift
    ├── Animal.swift
    └── FileManager (Apple)

NotificationService.swift
    └── UserNotifications (Apple)

SensorService.swift
    ├── CoreLocation
    ├── CoreMotion
    └── UIDevice

AchievementService.swift
    ├── NotificationService.swift
    └── UserDefaults
```

## 📝 Tamanho Estimado

| Ficheiro | Tipo | Linhas | Bytes |
|----------|------|--------|-------|
| AppDelegate.swift | Code | ~80 | 3KB |
| Animal.swift | Model | ~120 | 4KB |
| PetFinderService.swift | Service | ~150 | 5KB |
| CacheService.swift | Service | ~100 | 3.5KB |
| AnimalListViewController.swift | ViewController | ~150 | 5KB |
| AnimalDetailViewController.swift | ViewController | ~200 | 6.5KB |
| SettingsViewController.swift | ViewController | ~180 | 6KB |
| Outros Swift (12 ficheiros) | Variado | ~800 | 25KB |
| Info.plist | Config | ~50 | 2KB |
| .xcdatamodel | Config | ~20 | 1KB |
| Documentação (5 ficheiros) | Docs | ~500 | 20KB |
| **TOTAL** | | **2100+** | **80KB** |

## ✅ Checklist de Implementação

### Swift Files
- [x] AppDelegate.swift
- [x] SceneDelegate.swift
- [x] Animal.swift (Models)
- [x] PetFinderService.swift
- [x] CacheService.swift
- [x] NotificationService.swift
- [x] SensorService.swift
- [x] AchievementService.swift
- [x] CoreDataManager.swift
- [x] AnimalListViewController.swift
- [x] AnimalTableViewCell.swift
- [x] AnimalDetailViewController.swift
- [x] FollowingViewController.swift
- [x] AchievementsViewController.swift
- [x] SettingsViewController.swift
- [x] FilterViewController.swift
- [x] PhotoCollectionViewCell.swift
- [x] SwitchTableViewCell.swift

### Configuration Files
- [x] Info.plist (com permissões)
- [x] PetFinderDataModel.xcdatamodel

### Documentation
- [x] README.md
- [x] GITLAB_SETUP.md
- [x] TECHNICAL_DOCUMENTATION.md
- [x] PROJECT_SUMMARY.md
- [x] FILES_MANIFEST.md

## 🎯 Localização de Funcionalidades

### Funcionalidades Obrigatórias
| Funcionalidade | Ficheiro | Método |
|---|---|---|
| API Integration | PetFinderService | fetchAnimals(), fetchAnimalDetail() |
| Paginação | AnimalListViewController | willDisplay cell (linha infinita) |
| Filtros | FilterViewController | didSelectRowAt() |
| Cache | CacheService | cacheAnimals(), getCachedAnimals() |
| Notificações | NotificationService | scheduleDailyAnimalNotification() |
| Following | CoreDataManager | saveFollowingAnimal() |
| Partilha | AnimalDetailViewController | shareAnimal() |
| Core Data | CoreDataManager | Todas as operações de persistência |
| Threading | PetFinderService | DispatchQueue.global/main |
| Sensores | SensorService | startAccelerometerUpdates(), startLocationUpdates() |
| HIG | Todos ViewControllers | Usar systemBackground, safeArea, etc |
| Multi-screen | Todos | Auto Layout com constraints |

### Funcionalidades de Bonificação
| Funcionalidade | Ficheiro | Método |
|---|---|---|
| Achievements | AchievementService | unlockAchievement() |
| Proximidade | SensorService | currentLocation (CLLocationCoordinate2D) |
| Social Share | AnimalDetailViewController | UIActivityViewController |

---

**Versão**: 1.0  
**Data**: Outubro 2025  
**Status**: Completo ✅
