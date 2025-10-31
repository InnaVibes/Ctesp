# 🎯 PET FINDER APP - COMECE POR AQUI

Bem-vindo! Este ficheiro guia-o por todo o projeto.

---

## 🚀 Início Rápido (5 minutos)

### 1. Clonar Repositório
```bash
git clone https://gitlab.estg.ipp.pt/seu-usuario/petfinderapp.git
cd PetFinderApp
```

### 2. Abrir em Xcode
```bash
open PetFinderApp.xcodeproj
```

### 3. Configurar API Keys
**Ficheiro**: `PetFinderService.swift` (linhas ~15-16)
```swift
private let clientId = "SEU_PETFINDER_CLIENT_ID"
private let clientSecret = "SEU_PETFINDER_CLIENT_SECRET"
```

[Obter em: https://www.petfinder.com/developers](https://www.petfinder.com/developers)

### 4. Executar
- Seleccionar um simulador ou dispositivo
- Clicar **Play** (Cmd + R)

---

## 📁 Estrutura do Projeto

```
PetFinderApp/
├── 📖 DOCUMENTAÇÃO
│   ├── START_HERE.md (este ficheiro)
│   ├── README.md (instruções gerais)
│   ├── GITLAB_SETUP.md (Git)
│   ├── TECHNICAL_DOCUMENTATION.md (detalhes técnicos)
│   ├── PROJECT_SUMMARY.md (sumário)
│   ├── FILES_MANIFEST.md (lista de ficheiros)
│   └── ENTREGA_M1_M2.md (instruções de entrega)
│
├── 🎯 CÓDIGO PRINCIPAL
│   ├── AppDelegate.swift (inicialização)
│   ├── SceneDelegate.swift (scenes)
│   ├── Animal.swift (modelos)
│   ├── PetFinderService.swift (API)
│   ├── CacheService.swift (cache)
│   ├── NotificationService.swift (notificações)
│   ├── SensorService.swift (sensores)
│   ├── AchievementService.swift (conquistas)
│   ├── CoreDataManager.swift (persistência)
│   │
│   ├── AnimalListViewController.swift (lista)
│   ├── AnimalDetailViewController.swift (detalhe)
│   ├── FollowingViewController.swift (seguidos)
│   ├── AchievementsViewController.swift (conquistas)
│   ├── SettingsViewController.swift (definições)
│   ├── FilterViewController.swift (filtros)
│   │
│   ├── AnimalTableViewCell.swift (célula)
│   ├── PhotoCollectionViewCell.swift (foto)
│   └── SwitchTableViewCell.swift (switch)
│
└── ⚙️ CONFIGURAÇÃO
    ├── PetFinderDataModel.xcdatamodel (Core Data)
    └── Info.plist (permissões)
```

---

## 🎯 O que Funciona Agora

✅ **Implementado e Pronto:**
- Sistema de abas (TabBar com 4 tabs)
- Tela de Definições com todas as opções
- Core Data configurado
- Notificações locais
- API Petfinder integrada
- Cache de dados
- Sensores (GPS, Acelerómetro)
- Achievements
- UI responsiva

✅ **Todos os requisitos obrigatórios cobertos**

---

## ❓ Perguntas Frequentes

### P: Onde coloco o API Key?
**R:** Em `PetFinderService.swift`, linhas 14-16

### P: Como testar sem internet?
**R:** Usar o cache - os dados são guardados localmente após primeira fetch

### P: Como funciona o Git?
**R:** Ver `GITLAB_SETUP.md` para instruções passo-a-passo

### P: Posso customizar a UI?
**R:** Sim! Siga as Human Interface Guidelines. Ver `TECHNICAL_DOCUMENTATION.md`

### P: Como adicionar funcionalidades?
**R:** 
1. Criar um novo ficheiro (ex: `NewService.swift`)
2. Implementar a lógica
3. Integrar em `AppDelegate` ou `ViewControllers`
4. Fazer commit no Git

---

## 📚 Ficheiros Importantes por Tarefa

### Se quer mudar a UI:
→ `AnimalListViewController.swift`
→ `SettingsViewController.swift`
→ `AnimalDetailViewController.swift`

### Se quer mudar a lógica de API:
→ `PetFinderService.swift`

### Se quer mudar cache:
→ `CacheService.swift`

### Se quer add/remover tabas:
→ `AppDelegate.swift` (linhas 30-50)

### Se quer configurar notificações:
→ `NotificationService.swift`

---

## 🧪 Testar Funcionalidades

### Lista de Animais
1. App inicia na tab "Animais"
2. Deverá ver lista de animais
3. Scroll para mais animais (paginação)
4. Clique num animal para ver detalhe

### Definições
1. Abrir tab "Definições"
2. Mudar cache time ou items per page
3. Voltar para lista - alterações aplicadas

### Notificações
1. Em Definições, ativar "Notificações Diárias"
2. Configurar hora
3. App agendará notificação para essa hora

### Conquistas
1. Abrir tab "Conquistas"
2. Ver badges (bloqueado/desbloqueado)
3. Seguir animais para desbloquear

---

## 🚨 Problemas Comuns

| Erro | Solução |
|------|---------|
| "Falha na autenticação" | Verificar API Key em `PetFinderService.swift` |
| "Nenhum dado recebido" | Verificar conexão de rede |
| App não compila | Verificar Xcode version, fazer Clean Build |
| Cache não limpa | Ir a Definições e clicar "Limpar Dados" |
| Notificação não aparece | Verificar se notificações estão ativas no iOS |

---

## 📋 Próximos Passos

### Para Estudos:
1. Ler `README.md` para visão geral
2. Ler `TECHNICAL_DOCUMENTATION.md` para arquitetura
3. Explorar o código nos ViewControllers
4. Entender o fluxo de dados

### Para Desenvolvimento:
1. Fazer alterações num novo branch
2. Testar bem
3. Fazer commit com mensagem clara
4. Push para GitLab
5. Criar Merge Request

### Para Entrega:
1. Ler `ENTREGA_M1_M2.md`
2. Preparar relatório
3. Testar app completamente
4. Fazer push final para GitLab
5. Submeter no Moodle

---

## 💡 Tips Úteis

- **Prensa Cmd+U** para executar testes (quando adicionados)
- **Cmd+Shift+K** para Clean Build Folder
- **Cmd+Shift+J** para mostrar ficheiro no navegador
- **Cmd+Click** para abrir definição de ficheiro
- Usar **breakpoints** (Cmd+B) para debug

---

## 🔗 Recursos Úteis

| Recurso | Link |
|---------|------|
| Swift Docs | https://docs.swift.org |
| UIKit Framework | https://developer.apple.com/documentation/uikit |
| Petfinder API | https://www.petfinder.com/developers |
| Apple HIG | https://developer.apple.com/design |
| Core Data | https://developer.apple.com/documentation/coredata |
| Git Tutorial | https://git-scm.com/doc |

---

## 👥 Suporte

**Dúvidas sobre código?**
- Ler comentários no ficheiro
- Ver documentação técnica
- Explorar classe similar

**Dúvidas sobre projeto?**
- Email: cfpa@estq.ipp.pt ou jmt@estq.ipp.pt
- Aulas de PDM II

**Dúvidas sobre Git?**
- Ver `GITLAB_SETUP.md`
- Abrir issue no GitLab

---

## ✅ Checklist Antes de Começar

- [ ] Clonou o repositório
- [ ] Abriu em Xcode
- [ ] Adicionou API Keys
- [ ] Compilou com sucesso
- [ ] Viu a app a funcionar no simulador
- [ ] Explorou as 4 abas
- [ ] Leu este ficheiro completamente

---

## 🎓 Aprendizagens Esperadas

Após este projeto, deve saber:
- ✅ Estrutura de um projeto iOS
- ✅ UIKit (ViewControllers, TabBar, etc)
- ✅ Core Data
- ✅ Networking (URLSession, Codable)
- ✅ Threading/GCD
- ✅ Notificações locais
- ✅ Sensores (GPS, Acelerómetro)
- ✅ Git/GitLab
- ✅ UI/UX principles
- ✅ Debugging e troubleshooting

---

## 🎯 Próximo Passo

👉 **Recomendado**: Ler `README.md` a seguir

Bom trabalho! 🚀

---

*Criado: Outubro 2025*
*Para: UC PDM II - ESTG Porto*
