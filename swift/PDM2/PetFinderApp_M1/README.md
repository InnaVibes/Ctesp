# Pet Finder App - Milestone 1 (M1)

## Entrega M1 - Versão Inicial

### Conteúdo da Entrega

**Ficheiros Swift:**
- AppDelegate.swift (Configuração inicial, Core Data, Tab Bar)
- SettingsViewController.swift (Definições completas)
- AnimalListViewController.swift (Lista de animais - estrutura base)
- FollowingViewController.swift (Seguindo - estrutura base)
- AchievementsViewController.swift (Conquistas - estrutura base)
- FilterViewController.swift (Filtros de pesquisa)
- NotificationService.swift (Serviço de notificações)
- CoreDataManager.swift (Gestão de Core Data)

**Configuração:**
- PetFinderDataModel.xcdatamodel (Core Data configurado)
- Info.plist (Permissões)

**Documentação:**
- README.md (este ficheiro)
- RELATORIO_M1.md (Relatório inicial)

### Funcionalidades Implementadas M1

✅ **Navegação e Organização:**
- TabBarController com 4 tabs
- NavigationController em cada tab
- Títulos grandes (Large Titles)
- Safe Area Layout

✅ **Definições/Settings:**
- Configuração de cache (tempo de expiração)
- Configuração de items por página
- Notificações diárias (ativar/desativar)
- Hora preferencial para notificações
- Limpar todos os dados

✅ **Core Data:**
- Modelo configurado (AnimalEntity)
- Atributos: id, name, species, breed, gender, age, description, photoURLs, location, isFollowing, savedDate
- CoreDataManager com CRUD completo
- Pronto para persistência de dados

✅ **Notificações:**
- Sistema de notificações locais
- Agendamento diário configurável
- Cancelamento de notificações

✅ **Filtros:**
- FilterViewController implementado
- Filtros por espécie, raça, género e idade
- Delegate pattern para comunicação

### Estrutura do Projeto

```
PetFinderApp_M1/
├── AppDelegate.swift
├── ViewControllers/
│   ├── AnimalListViewController.swift
│   ├── FollowingViewController.swift
│   ├── AchievementsViewController.swift
│   ├── SettingsViewController.swift
│   └── FilterViewController.swift
├── Services/
│   └── NotificationService.swift
├── CoreData/
│   ├── CoreDataManager.swift
│   └── PetFinderDataModel.xcdatamodeld/
├── Resources/
│   ├── Assets.xcassets/
│   └── LaunchScreen.storyboard
└── Info.plist
```

### Como Executar

1. Abrir o projeto no Xcode
   ```bash
   open PetFinderApp_M1.xcodeproj
   ```
2. Selecionar simulador iOS (iPhone 15 Pro ou superior)
3. Build and Run (Cmd + R)

### Requisitos

- Xcode 15.0 ou superior
- iOS 15.0 ou superior
- Swift 5.0

### API Keys

Para M2, será necessário configurar:
- Petfinder API Client ID
- Petfinder API Client Secret

Obter em: https://www.petfinder.com/developers

### Próximos Passos (M2)

- Implementar PetFinderService (API)
- Implementar CacheService
- Implementar SensorService
- Completar ViewControllers com funcionalidades
- Adicionar filtros e pesquisa
- Implementar sistema de achievements
- Galeria de fotos
- Partilha social

### Conformidade com Requisitos M1

| Requisito | Status |
|-----------|--------|
| Versão inicial do relatório | ✅ |
| Navegação e organização | ✅ |
| Definições/settings | ✅ |
| Core Data configurado | ✅ |
| Notificações | ✅ |
| App Icon | ⏳ M2 |
| Launch Screen | ✅ |

### Notas Técnicas

- **Arquitetura:** MVC com camada de serviços
- **Persistência:** Core Data com NSManagedObject
- **UI:** UIKit programático (sem Storyboards exceto LaunchScreen)
- **Notificações:** UserNotifications framework
- **Thread-safe:** CoreDataManager usa o main context

### Resolução de Problemas

**Erro: "Cannot find AnimalEntity"**
- Solução: Editor → Create NSManagedObject Subclass no Xcode

**Erro: "App crashes on launch"**
- Verificar se o Core Data model está incluído no target
- Verificar se Info.plist está configurado

### Estrutura de Código

- Todos os ViewControllers usam programmatic UI
- Auto Layout com constraints
- Delegate patterns para comunicação
- Singleton patterns para serviços
- UserDefaults para configurações

---

**Grupo:** [Nome do Grupo]  
**Data:** Novembro 2025  
**Milestone:** M1 (40%)
