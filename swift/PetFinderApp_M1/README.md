# Pet Finder App - Milestone 1 (M1)

## Entrega M1 - Versão Inicial

### Conteúdo da Entrega

**Ficheiros Swift:**
- AppDelegate.swift (Configuração inicial, Core Data, Tab Bar)
- SettingsViewController.swift (Definições completas)
- AnimalListViewController.swift (Lista de animais - estrutura base)
- FollowingViewController.swift (Seguindo - estrutura base)
- AchievementsViewController.swift (Conquistas - estrutura base)
- NotificationService.swift (Serviço de notificações)

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
- Pronto para persistência de dados

✅ **Notificações:**
- Sistema de notificações locais
- Agendamento diário configurável
- Cancelamento de notificações

### Estrutura do Projeto

```
PetFinderApp/
├── AppDelegate.swift
├── AnimalListViewController.swift
├── FollowingViewController.swift
├── AchievementsViewController.swift
├── SettingsViewController.swift
├── NotificationService.swift
├── PetFinderDataModel.xcdatamodel
├── Info.plist
└── README.md
```

### Como Executar

1. Abrir o projeto no Xcode
2. Selecionar simulador iOS (iPhone 15 Pro ou superior)
3. Build and Run (Cmd + R)

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
| Launch Screen | ⏳ M2 |

### Notas

- Estrutura base preparada para M2
- Arquitetura MVC implementada
- Código limpo e documentado
- Pronto para integração com API

---

**Grupo:** [Nome do Grupo]  
**Data:** Novembro 2025  
**Milestone:** M1 (40%)
