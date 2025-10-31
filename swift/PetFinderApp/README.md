# Pet Finder - Aplicação iOS para Adoção de Animais

## 📱 Descrição

Aplicação iOS nativa desenvolvida em Swift utilizando UIKit para descobrir e seguir animais disponíveis para adoção através da API Petfinder.

## 🎯 Funcionalidades Principais

### Obrigatórias
- ✅ Integração com API Petfinder for Developers
- ✅ Listagem de animais com paginação configurável
- ✅ Filtros por espécie, raça, género e idade
- ✅ Detalhe completo de cada animal
- ✅ Cache de dados com período de validade configurável
- ✅ Notificações diárias com animal aleatório
- ✅ Lista "Following" (animais que segue)
- ✅ Partilha em redes sociais
- ✅ Utilização de sensores (Acelerómetro, Localização, Proximidade)
- ✅ Suporte para múltiplos ecrãs (iPhone e iPad)
- ✅ UITableView/UICollectionView
- ✅ Core Data para persistência
- ✅ Operações assíncronas (GCD/Threads)
- ✅ Human Interface Guidelines

### De Bonificação
- 🎁 Sistema de Achievements/Conquistas
- 🎁 Detectar animais nas proximidades (GPS)
- 🎁 Web services adicionais
- 🎁 Integração com sistema iOS

## 🛠️ Tecnologias Utilizadas

- **Linguagem**: Swift 5+
- **IDE**: Xcode
- **UI**: UIKit
- **Persistência**: Core Data
- **Networking**: URLSession
- **Sensores**: CoreLocation, CoreMotion
- **Notificações**: UserNotifications
- **Cache**: File System + UserDefaults

## 📋 Estrutura do Projeto

```
PetFinderApp/
├── AppDelegate.swift                 # Configuração inicial e ciclo de vida
├── Animal.swift                      # Modelos de dados
├── PetFinderService.swift            # Serviço de API
├── CacheService.swift                # Gerenciamento de cache
├── NotificationService.swift         # Serviço de notificações
├── SensorService.swift               # Serviço de sensores
├── AchievementService.swift          # Serviço de conquistas
├── CoreDataManager.swift             # Gerenciamento Core Data
├── AnimalListViewController.swift     # Lista de animais
├── AnimalTableViewCell.swift         # Célula da tabela
├── AnimalDetailViewController.swift   # Detalhe do animal
├── FollowingViewController.swift      # Lista de seguidos
├── AchievementsViewController.swift   # Tela de conquistas
├── SettingsViewController.swift       # Definições
├── FilterViewController.swift         # Filtros
├── PetFinderDataModel.xcdatamodel   # Modelo Core Data
├── Info.plist                        # Configurações e permissões
└── README.md                         # Este ficheiro
```

## 🚀 Configuração Inicial

### 1. Registar API Keys

1. Ir para https://www.petfinder.com/developers
2. Criar uma conta
3. Gerar Client ID e Client Secret
4. Actualizar em `PetFinderService.swift`:

```swift
private let clientId = "SEU_CLIENT_ID"
private let clientSecret = "SEU_CLIENT_SECRET"
```

### 2. Criar Projeto no Xcode

1. Abrir Xcode
2. File > New > Project
3. Seleccionar "App" 
4. Configurar:
   - Product Name: "PetFinderApp"
   - Organization Identifier: "com.estg.pdm2"
   - Language: Swift
   - Interface: Storyboard
   - Core Data: Ativado

### 3. Integrar Ficheiros

1. Copiar todos os ficheiros Swift para o projeto
2. Adicionar o `PetFinderDataModel.xcdatamodel` ao projeto

## 📱 Funcionalidades em Detalhe

### Listagem de Animais
- Scroll infinito com carregamento automático
- Pesquisa por nome/espécie
- Filtros avançados
- Cada item mostra foto, nome, espécie e localização

### Detalhe do Animal
- Galeria de fotos (swipe horizontal)
- Descrição completa
- Informações de género, idade, raça
- Botão de seguir/remover
- Partilha em redes sociais
- Botão para animal aleatório

### Seguindo (Following)
- Lista local de animais seguidos
- Persistência em Core Data
- Opção de remover da lista

### Conquistas (Achievements)
- Primeiro animal seguido
- 5, 10 e 20 animais seguidos
- Explorador (10 animais visualizados)
- Visitante diário (7 dias seguidos)

### Definições
- **Cache**: Configurar período de validade
- **Items por página**: Ajustar quantidade de animais por carregamento
- **Notificações**: Ativar/desativar e configurar hora
- **Limpar dados**: Remover todos os dados locais

## 📡 API Petfinder

### Autenticação
- OAuth 2.0 com Client Credentials
- Token com validade configurável

### Endpoints Utilizados

#### Listar Animais
```
GET /animals
Parâmetros: type, breed, gender, age, location, page, limit
```

#### Detalhe do Animal
```
GET /animals/{id}
```

## 🔒 Permissões Necessárias

- **Localização**: Para buscar animais próximos (when in use)
- **Câmara**: Para funcionalidades futuras
- **Galeria**: Para funcionalidades futuras
- **Notificações**: Para notificações diárias

## 🧪 Testes

### Testes Unitários
```bash
Cmd + U (no Xcode)
```

### Testes Manuais
1. Listar animais
2. Aplicar filtros
3. Ver detalhe
4. Seguir/remover animal
5. Partilhar animal
6. Verificar notificações
7. Testar definições

## 🐛 Resolução de Problemas

### Erro: "Falha na autenticação com a API"
- Verificar API Key e Secret em `PetFinderService.swift`
- Confirmar que o cliente está registado no Petfinder

### Erro: "Nenhum dado recebido"
- Verificar conexão de rede
- Validar localização (formato PT para Portugal)

### Cache não expira
- Verificar tempo de expiração nas Definições
- Limpar cache manualmente

## 📚 Documentação

- [Petfinder API Docs](https://www.petfinder.com/developers)
- [Apple UIKit Documentation](https://developer.apple.com/documentation/uikit)
- [Swift Documentation](https://docs.swift.org/)
- [Core Data Documentation](https://developer.apple.com/documentation/coredata)

## 📝 Requisitos M1 (40%)

- [x] Versão inicial do relatório
- [x] Navegação e organização geral
- [x] Definições/settings
- [x] Core Data configurado
- [x] Notificações

## 📝 Requisitos M2 (60%)

- [x] Versão final do relatório
- [x] Todas as funcionalidades obrigatórias
- [x] Funcionalidades de bonificação
- [x] Detalhes de implementação

## 👥 Autores

Grupo de PDM II - ESTG Porto

## 📄 Licença

Este projeto é fornecido para fins educacionais.

---

**Última atualização**: Outubro 2025
