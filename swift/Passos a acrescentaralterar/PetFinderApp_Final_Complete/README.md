# PetFinder App - Versão Completa

## Funcionalidades

### ✅ Tabs Implementadas
1. **Início** - Lista de animais disponíveis para adoção
2. **Seguindo** - Animais que o utilizador está a seguir
3. **Conquistas** - Sistema de achievements com progresso
4. **Definições** - Configurações da aplicação

### 🏆 Sistema de Conquistas
- **Primeiro Passo**: Seguir o primeiro animal
- **Colecionador**: Seguir 5 animais
- **Protetor**: Seguir 10 animais
- **Campeão**: Seguir 25 animais
- **Visitante Regular**: Abrir a app 5 vezes
- **Explorador Dedicado**: Abrir a app 20 vezes

### 📊 Tracking Automático
- Contador de aberturas da app
- Visualizações de animais
- Partilhas realizadas
- Animais seguidos

### 💾 Core Data
- Persistência de animais
- Sistema de favoritos
- Estatísticas do utilizador
- Gestão de conquistas

## Arquitetura

```
PetFinderApp_M1/
├── App/
│   ├── AppDelegate.swift
│   └── Info.plist
├── Core/
│   ├── CoreDataManager.swift
│   ├── UserStatsEntity.swift
│   └── PetFinderModel.xcdatamodeld/
├── Constants/
│   ├── APIConstants.swift
│   ├── UIConstants.swift
│   └── UserDefaultsKeys.swift
├── Models/
│   ├── Achievement.swift
│   ├── AdoptAPetModel.swift
│   ├── PetUnifiedModel.swift (Core Data)
│   └── StaticPetModel.swift
├── Network/
│   ├── APIClient.swift
│   ├── APIURLBuilder.swift
│   ├── CacheManager.swift
│   ├── NetworkError.swift
│   └── NetworkManager.swift
├── Managers/
│   ├── AchievementsManager.swift
│   └── SyncManager.swift
├── ViewControllers/
│   ├── HomeViewController.swift
│   ├── FollowingViewController.swift
│   ├── AchievementsViewController.swift
│   ├── PetDetailViewController.swift
│   └── SettingsViewController.swift
├── Views/Cells/
│   ├── AnimalTableViewCell.swift
│   └── AchievementCell.swift
├── Extensions/
│   └── PetUnifiedModel+Extensions.swift
└── Utils/
    ├── AlertHelper.swift
    └── LoadingHelper.swift
```

## Uso

### Navegação
- Tab Início: Ver todos os animais disponíveis
- Tab Seguindo: Ver animais que está a seguir
- Tab Conquistas: Ver progresso de achievements
- Tab Definições: Limpar cache

### Interação
- **Tap no animal**: Ver detalhes
- **Tap no coração**: Seguir/deixar de seguir
- **Swipe na célula**: Acções rápidas
- **Botão partilhar**: Partilhar animal (conta para achievements)

### Conquistas
As conquistas desbloqueiam automaticamente quando os objetivos são alcançados.
Notificações in-app informam quando uma nova conquista é desbloqueada.

## Configuração

### API
A app usa automaticamente a API estática do GitHub Pages.
Não é necessária configuração de API Key.

### Cache
- Cache automático de 30 minutos
- Pode limpar manualmente nas Definições

## Desenvolvimento

### Core Data
O modelo Core Data inclui:
- **PetUnifiedModel**: Dados dos animais
- **UserStatsEntity**: Estatísticas do utilizador

### Achievements Manager
Gere automaticamente:
- Incremento de contadores
- Verificação de conquistas
- Notificações de desbloqueio

### Network Manager
- Fallback automático para API estática
- Cache inteligente
- Gestão de erros

## Notas Técnicas

- iOS 15.0+
- Swift 5.0
- UIKit (sem Storyboards)
- Core Data para persistência
- Auto Layout programático

## Debug Features

Em modo DEBUG (#if DEBUG):
- Botão de Reset nas Conquistas
- Logs detalhados no console

---

Versão: 2.0
Data: Dezembro 2025
