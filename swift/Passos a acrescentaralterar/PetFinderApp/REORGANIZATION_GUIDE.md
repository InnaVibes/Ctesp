# Guia de Reorganização do Projeto PetFinder

## 📂 Nova Estrutura de Pastas

Este guia detalha como reorganizar completamente o código do projeto PetFinder seguindo as melhores práticas de arquitetura iOS.

## Estrutura Recomendada

```
PetFinderApp_M1/
├── App/
│   ├── AppDelegate.swift
│   └── Info.plist
│
├── Models/
│   ├── Achievement.swift
│   ├── AddressInfo.swift
│   ├── BreedInfo.swift
│   ├── ContactInfo.swift
│   ├── PetAPIModel.swift
│   ├── PetAPIResponse.swift
│   └── PhotoInfo.swift
│
├── Network/
│   ├── APIClient.swift
│   ├── APIURLBuilder.swift
│   ├── CacheManager.swift
│   ├── NetworkError.swift
│   └── NetworkManager.swift
│
├── Managers/
│   ├── CoreDataManager.swift
│   ├── SyncManager.swift
│   └── AchievementsManager.swift
│
├── Services/
│   └── NotificationService.swift
│
├── ViewControllers/
│   ├── AnimalListViewController.swift
│   ├── AnimalDetailViewController.swift
│   ├── FollowingViewController.swift
│   ├── AchievementsViewController.swift
│   ├── SettingsViewController.swift
│   └── FilterViewController.swift
│
├── Views/
│   ├── Cells/
│   │   ├── AnimalTableViewCell.swift
│   │   ├── FollowingAnimalCell.swift
│   │   └── AchievementCell.swift
│   └── Components/
│       └── (componentes reutilizáveis futuros)
│
├── Extensions/
│   ├── PetAPIModel+Formatting.swift
│   └── PetAPIModel+Localization.swift
│
├── Utils/
│   ├── AlertHelper.swift
│   └── LoadingHelper.swift
│
├── Constants/
│   ├── APIConstants.swift
│   ├── UIConstants.swift
│   └── UserDefaultsKeys.swift
│
├── CoreData/
│   ├── PetFinderDataModel.xcdatamodeld
│   └── (classes geradas automaticamente)
│
└── Resources/
    ├── Assets.xcassets
    ├── LaunchScreen.storyboard
    └── MockData.swift
```

## 📋 Ficheiros Criados (23 ficheiros)

### 1. Models (7 ficheiros)
- `Achievement.swift` - Modelo de conquista
- `AddressInfo.swift` - Modelo de endereço
- `BreedInfo.swift` - Modelo de informação de raça
- `ContactInfo.swift` - Modelo de contacto
- `PetAPIModel.swift` - Modelo principal de animal da API
- `PetAPIResponse.swift` - Modelo de resposta da API
- `PhotoInfo.swift` - Modelo de informação de foto

### 2. Network (5 ficheiros)
- `APIClient.swift` - Cliente HTTP genérico
- `APIURLBuilder.swift` - Construtor de URLs da API
- `CacheManager.swift` - Gestor de cache em memória
- `NetworkError.swift` - Enumeração de erros de rede
- `NetworkManager.swift` - Gestor principal de rede

### 3. Managers (2 ficheiros)
- `SyncManager.swift` - Sincronização API ↔ Core Data
- `AchievementsManager.swift` - Gestor de conquistas

### 4. Extensions (2 ficheiros)
- `PetAPIModel+Formatting.swift` - Formatação de dados
- `PetAPIModel+Localization.swift` - Tradução para português

### 5. Utils (2 ficheiros)
- `AlertHelper.swift` - Utilitário para alertas
- `LoadingHelper.swift` - Utilitário para loading

### 6. Constants (3 ficheiros)
- `APIConstants.swift` - Constantes da API
- `UIConstants.swift` - Constantes de UI
- `UserDefaultsKeys.swift` - Chaves do UserDefaults

### 7. Views (2 ficheiros)
- `AnimalTableViewCell.swift` - Célula de animal
- `AchievementCell.swift` - Célula de conquista

## 🔄 Passo a Passo da Reorganização

### Passo 1: Backup

```bash
cd swift/PDM2/
cp -r PetFinderApp_M1 PetFinderApp_M1_backup_$(date +%Y%m%d)
```

### Passo 2: Criar Nova Estrutura de Pastas

Abra o Xcode e crie os seguintes grupos (pastas amarelas):

1. Clique com botão direito em `PetFinderApp_M1`
2. Selecione "New Group"
3. Crie os seguintes grupos:
   - App
   - Models
   - Network
   - Managers
   - Services
   - ViewControllers
   - Views
   - Views/Cells
   - Extensions
   - Utils
   - Constants
   - CoreData
   - Resources

### Passo 3: Mover Ficheiros Existentes

#### App
- Mova `AppDelegate.swift` para `App/`
- Mova `Info.plist` para `App/`

#### ViewControllers
- Já devem estar na pasta `ViewControllers/`

#### CoreData
- Mova `CoreDataManager.swift` para `Managers/`
- Mantenha `PetFinderDataModel.xcdatamodeld` em `CoreData/`

#### Services
- Mantenha `NotificationService.swift` em `Services/`

#### Resources
- Mova `Assets.xcassets` para `Resources/`
- Mova `LaunchScreen.storyboard` para `Resources/`
- Mova `MockData.swift` para `Resources/`

### Passo 4: Adicionar Novos Ficheiros

Para cada pasta, adicione os ficheiros correspondentes:

#### Models/
Adicione todos os 7 ficheiros da pasta `organized_project/Models/`:
- Achievement.swift
- AddressInfo.swift
- BreedInfo.swift
- ContactInfo.swift
- PetAPIModel.swift
- PetAPIResponse.swift
- PhotoInfo.swift

#### Network/
Adicione todos os 5 ficheiros da pasta `organized_project/Network/`:
- APIClient.swift
- APIURLBuilder.swift
- CacheManager.swift
- NetworkError.swift
- NetworkManager.swift

#### Managers/
Adicione os 2 novos ficheiros:
- SyncManager.swift
- AchievementsManager.swift

#### Extensions/
Adicione os 2 ficheiros:
- PetAPIModel+Formatting.swift
- PetAPIModel+Localization.swift

#### Utils/
Adicione os 2 ficheiros:
- AlertHelper.swift
- LoadingHelper.swift

#### Constants/
Adicione os 3 ficheiros:
- APIConstants.swift
- UIConstants.swift
- UserDefaultsKeys.swift

#### Views/Cells/
Adicione os ficheiros de célula:
- AnimalTableViewCell.swift (substituir o existente em ViewControllers)
- AchievementCell.swift

### Passo 5: Atualizar ViewControllers

Agora você precisará atualizar os ViewControllers existentes para usar os novos componentes:

#### AnimalListViewController.swift

Substituir imports e uso de constantes:
```swift
// Usar UIConstants ao invés de valores hardcoded
tableView.rowHeight = UIConstants.tableRowHeight

// Usar AlertHelper ao invés de criar UIAlertController manualmente
AlertHelper.showError(on: self, error: error)

// Usar LoadingHelper
LoadingHelper.show(on: self, message: "Sincronizando...")
```

#### SettingsViewController.swift

Substituir chaves de UserDefaults:
```swift
// Antes:
let apiKey = UserDefaults.standard.string(forKey: "apiKey")

// Depois:
let apiKey = UserDefaults.standard.string(forKey: UserDefaultsKeys.apiKey)
```

#### AchievementsViewController.swift

Usar AchievementsManager:
```swift
// Antes:
let achievements: [Achievement] = [...]

// Depois:
let achievements = AchievementsManager.shared.getAllAchievements()
```

### Passo 6: Atualizar CoreDataManager

Adicionar método para funcionar com SyncManager:
```swift
// Já existe, apenas verificar se está acessível
```

### Passo 7: Verificar Imports

Certifique-se de que todos os ficheiros têm os imports necessários:

```swift
import Foundation  // Para tipos básicos
import UIKit       // Para componentes de UI
import CoreData    // Para Core Data
```

### Passo 8: Compilar e Testar

1. Limpar build folder: `⌘ + Shift + K`
2. Compilar: `⌘ + B`
3. Corrigir erros de import/referência
4. Executar: `⌘ + R`

## 🎯 Benefícios da Nova Estrutura

### Separação de Responsabilidades
- **Models**: Apenas estruturas de dados
- **Network**: Apenas comunicação com API
- **Managers**: Lógica de negócio
- **ViewControllers**: Apenas lógica de apresentação
- **Views**: Componentes UI reutilizáveis
- **Utils**: Funções auxiliares
- **Constants**: Valores constantes centralizados

### Manutenibilidade
- ✅ Fácil de encontrar código
- ✅ Fácil de adicionar novos recursos
- ✅ Fácil de testar componentes individuais
- ✅ Reduz duplicação de código

### Escalabilidade
- ✅ Estrutura preparada para crescer
- ✅ Componentes reutilizáveis
- ✅ Baixo acoplamento
- ✅ Alta coesão

### Legibilidade
- ✅ Código organizado por funcionalidade
- ✅ Nomes claros e descritivos
- ✅ Responsabilidades bem definidas
- ✅ Fácil onboarding de novos desenvolvedores

## 📊 Comparação: Antes vs Depois

### ANTES (Estrutura Plana)
```
PetFinderApp_M1/
├── AppDelegate.swift (300 linhas)
├── NetworkManager.swift (500 linhas)
├── CoreDataManager.swift (300 linhas)
├── AnimalListViewController.swift (400 linhas)
├── SettingsViewController.swift (350 linhas)
└── ...
```

### DEPOIS (Estrutura Modular)
```
PetFinderApp_M1/
├── Models/ (7 ficheiros, ~150 linhas cada)
├── Network/ (5 ficheiros, ~150 linhas cada)
├── Managers/ (3 ficheiros, ~200 linhas cada)
├── Utils/ (2 ficheiros, ~100 linhas cada)
├── Constants/ (3 ficheiros, ~50 linhas cada)
└── ...
```

**Resultado:**
- Ficheiros menores e mais focados
- Mais fácil de navegar
- Mais fácil de testar
- Mais fácil de manter

## 🔍 Padrões Aplicados

### 1. Singleton Pattern
- `NetworkManager.shared`
- `CoreDataManager.shared`
- `CacheManager.shared`
- `SyncManager.shared`
- `AchievementsManager.shared`

### 2. Delegation Pattern
- `AnimalTableViewCellDelegate`
- `FilterViewControllerDelegate`

### 3. Builder Pattern
- `APIURLBuilder`

### 4. Repository Pattern
- `CoreDataManager` (repositório local)
- `NetworkManager` (repositório remoto)

### 5. MVC (Model-View-Controller)
- Models: Estruturas de dados
- Views: Células e componentes UI
- Controllers: ViewControllers

## ⚠️ Notas Importantes

### Não Quebra a Build
Todos os ficheiros novos são **adições**, não substituições (exceto cells). Os ficheiros originais continuam funcionando.

### Migração Gradual
Você pode migrar **gradualmente**:
1. Adicionar novos ficheiros
2. Atualizar um ViewController de cada vez
3. Testar após cada mudança
4. Remover código antigo quando novo estiver funcionando

### Testes
Após reorganizar:
- ✅ Testar login/configuração de API
- ✅ Testar sincronização de dados
- ✅ Testar navegação entre telas
- ✅ Testar funcionalidade de seguir/deixar de seguir
- ✅ Testar modo offline

## 📝 Checklist de Reorganização

- [ ] Fazer backup do projeto
- [ ] Criar estrutura de pastas no Xcode
- [ ] Adicionar ficheiros de Models
- [ ] Adicionar ficheiros de Network
- [ ] Adicionar ficheiros de Managers
- [ ] Adicionar ficheiros de Extensions
- [ ] Adicionar ficheiros de Utils
- [ ] Adicionar ficheiros de Constants
- [ ] Adicionar ficheiros de Views
- [ ] Mover ficheiros existentes
- [ ] Atualizar imports nos ViewControllers
- [ ] Substituir valores hardcoded por constantes
- [ ] Compilar projeto (⌘ + B)
- [ ] Corrigir erros de compilação
- [ ] Executar app (⌘ + R)
- [ ] Testar todas as funcionalidades
- [ ] Remover código duplicado/antigo
- [ ] Commit das mudanças

## 🎓 Próximos Passos (Melhorias Futuras)

### Fase 1: Testes
- Adicionar pasta `Tests/`
- Criar testes unitários para Managers
- Criar testes de UI para ViewControllers

### Fase 2: Dependency Injection
- Remover Singletons onde possível
- Injetar dependências nos inicializadores
- Facilitar testes

### Fase 3: Coordinator Pattern
- Adicionar pasta `Coordinators/`
- Separar lógica de navegação
- Melhorar desacoplamento

### Fase 4: MVVM
- Adicionar pasta `ViewModels/`
- Criar ViewModels para cada tela
- Melhorar testabilidade

## 📚 Recursos

- [iOS Architecture Patterns](https://medium.com/ios-os-x-development/ios-architecture-patterns-ecba4c38de52)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

---

**Autor**: Sistema de Reorganização PetFinder
**Data**: Novembro 2025
**Versão**: 2.0
