# Documentação Técnica - Pet Finder App

## 🏗️ Arquitetura

### Padrão MVC
- **Model**: `Animal.swift`, `Location.swift`, `AnimalEntity.swift`
- **View**: ViewControllers e Células
- **Controller**: ViewControllers

### Serviços
```
┌─────────────────────────────────────┐
│      ViewControllers (UI)           │
├─────────────────────────────────────┤
│      Services Layer                 │
│ ┌──────────┬──────────┬──────────┐ │
│ │PetFinder │  Cache   │  Notif   │ │
│ │ Service  │ Service  │ Service  │ │
│ └──────────┴──────────┴──────────┘ │
├─────────────────────────────────────┤
│      Data Layer                     │
│ ┌──────────┬──────────┬──────────┐ │
│ │CoreData  │FileSystem│UserDefaul│ │
│ │Manager   │  Cache   │    ts    │ │
│ └──────────┴──────────┴──────────┘ │
└─────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### 1. Obter Animais

```
AnimalListVC
    ↓
PetFinderService.fetchAnimals()
    ↓
URLSession (API Call)
    ↓
JSON Decode → [Animal]
    ↓
CacheService.cacheAnimals()
    ↓
Atualizar UITableView
```

### 2. Seguir Animal

```
AnimalDetailVC → toggleFollow()
    ↓
CoreDataManager.saveFollowingAnimal()
    ↓
AnimalEntity (CoreData)
    ↓
AchievementService.updateFollowingProgress()
    ↓
Notificar sucesso
```

### 3. Notificações Diárias

```
App Launch
    ↓
NotificationService.scheduleDailyAnimalNotification()
    ↓
PetFinderService.fetchRandomAnimal()
    ↓
UNUserNotificationCenter.add()
    ↓
Sistema iOS entrega notificação na hora agendada
```

## 🔐 Segurança

### API Keys
- Não hardcodificar em produção
- Usar ficheiro de configuração separado
- Implementar .gitignore para credenciais

### Dados do Utilizador
- Core Data encriptado por padrão
- Permissões explícitas para cada funcionalidade
- Eliminar dados quando usuario desejar

## ⚡ Performance

### Otimizações

#### 1. Carregamento de Imagens
```swift
// Não bloqueia thread principal
URLSession.shared.dataTask(with: url) { data, _, _ in
    if let data = data {
        DispatchQueue.main.async {
            self.imageView.image = UIImage(data: data)
        }
    }
}.resume()
```

#### 2. Paginação
```
Ao atingir final da lista → Carregar próxima página
Evita carregar tudo de uma vez
```

#### 3. Cache
```
Primeiro: Tentar cache local
Depois: Se expirada, buscar API
Guardar resultado no cache
```

#### 4. Operações Assíncronas
```
DispatchQueue.global(qos: .userInitiated) {
    // Operação pesada
    DispatchQueue.main.async {
        // Atualizar UI
    }
}
```

## 📊 Estrutura Core Data

```
Entity: AnimalEntity
├── id: Int64
├── name: String
├── species: String
├── breed: String
├── gender: String
├── age: String
├── descriptionText: String (Optional)
├── photoURLs: String (JSON)
├── location: String (JSON)
├── isFollowing: Bool
└── savedDate: Date (Optional)
```

## 🔌 Integração API Petfinder

### Autenticação OAuth 2.0

```swift
POST /oauth2/token
Body: {
    grant_type: "client_credentials",
    client_id: "SEU_ID",
    client_secret: "SEU_SECRET"
}
Response: {
    access_token: "...",
    token_type: "Bearer",
    expires_in: 3600
}
```

### Endpoints

#### 1. Listar Animais
```
GET /animals
Params:
- type: dog, cat, rabbit, etc
- breed: raça
- gender: male, female
- age: baby, young, adult, senior
- location: localização
- page: número da página
- limit: animais por página (padrão 20)
```

#### 2. Detalhe Animal
```
GET /animals/{id}
Response: { animal: {...} }
```

## 🎨 Human Interface Guidelines

### Conformidade

- [x] Navigation: UITabBarController + UINavigationController
- [x] Tab Bar Items: 4 tabs principais
- [x] Large Titles: Em listas e definições
- [x] Safe Area: Respeitado em todos os ViewControllers
- [x] Adaptive Layout: Funciona em iPhone e iPad
- [x] Dark Mode: Suportado via systemBackground
- [x] Accessibility: Botões com tamanho adequado

### Cores e Tipografia

```swift
// Cores
backgroundColor = .systemBackground
textColor = .label
secondaryTextColor = .secondaryLabel

// Fontes
Title: UIFont.boldSystemFont(ofSize: 24)
Subtitle: UIFont.systemFont(ofSize: 14)
Body: UIFont.systemFont(ofSize: 14)
Caption: UIFont.systemFont(ofSize: 12)
```

## 🧵 Threading

### Main Thread (UI Updates)
```swift
DispatchQueue.main.async {
    tableView.reloadData()
}
```

### Background Thread (Operações)
```swift
DispatchQueue.global(qos: .userInitiated).async {
    // API calls, cálculos, etc
}
```

### Serial vs Concurrent
```swift
// Serial: uma tarefa por vez
DispatchQueue(label: "serial")

// Concurrent: múltiplas tarefas
DispatchQueue(label: "concurrent", attributes: .concurrent)
```

## 🧪 Testes Sugeridos

### Testes Unitários
```swift
// PetFinderServiceTests
testFetchAnimalsSuccess()
testFetchAnimalsFailure()
testAuthentication()

// CacheServiceTests
testCacheSave()
testCacheExpiration()
testCacheCleanup()

// AchievementServiceTests
testUnlockAchievement()
testAchievementProgress()
```

### Testes de Integração
```swift
// Fluxo completo
testFetchAndCacheAnimals()
testFollowAndAchievements()
testNotificationScheduling()
```

### Testes da UI
```swift
// Views
testAnimalListDisplaysCorrectly()
testFilterAppliesCorrectly()
testDetailViewLoadsData()
```

## 📱 Suporte a Diferentes Dispositivos

### iPhone (Portrait e Landscape)
- Tabela de 1 coluna
- Imagens redimensionadas
- Botões acessíveis

### iPad (Portrait e Landscape)
- Split View suportada
- Layouts adaptativos
- Keyboard shortcuts

### Safe Area
```swift
// Sempre usar safe area
view.safeAreaLayoutGuide.topAnchor
view.safeAreaLayoutGuide.bottomAnchor
```

## 🔋 Otimização de Bateria

### Best Practices

1. **Localização**: Desativar quando não em uso
```swift
if userNeedsLocation {
    sensorService.startLocationUpdates()
}
```

2. **Imagens**: Usar resolução apropriada
```swift
// Não carregar imagens @3x em iPhone SE
```

3. **Networking**: Agrupar requisições
```swift
// Evitar múltiplas requisições pequenas
```

4. **Timers**: Cancelar quando não necessário
```swift
timer?.invalidate()
```

## 🐛 Debug e Logging

### Print Levels
```swift
// Info
print("ℹ️ Iniciando fetch")

// Warning
print("⚠️ Cache expirada")

// Error
print("❌ Erro: \(error)")

// Success
print("✅ Operação completada")
```

### Xcode Console
- View Memory Graph
- Profiler
- Debugger

## 📈 Escalabilidade

### Possíveis Melhorias

1. **MVVM**: Adicionar ViewModels
2. **Reactive Programming**: Usar Combine
3. **Offline First**: Sincronização mais sofisticada
4. **Backend**: Autenticação de utilizador
5. **Analytics**: Rastreamento de uso
6. **A/B Testing**: Variações de UI
7. **Push Notifications**: Remote notifications
8. **iCloud Sync**: CloudKit para backup

## 🔄 Manutenção

### Updates Regulares
- Atualizar SDK iOS
- Atualizar Swift
- Verificar mudanças na API
- Testar em novos dispositivos

### Monitoramento
- Crash Reports
- Performance Metrics
- User Feedback
- Analytics

---

**Última atualização**: Outubro 2025
