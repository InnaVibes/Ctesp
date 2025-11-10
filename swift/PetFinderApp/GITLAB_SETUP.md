# Configuração GitLab - Pet Finder App

## 📋 Instruções para Configurar Repositório GitLab

### 1. Criar Repositório no GitLab

#### Via GitLab.com (recomendado para estudantes)
1. Aceder a https://gitlab.com
2. Criar conta ou fazer login
3. Novo Projeto > Novo projeto em branco
4. Preencher:
   - **Project name**: PetFinderApp
   - **Project slug**: petfinderapp
   - **Visibility**: Private (para repositório privado)
   - **Initialize repository with a README**: Não

#### Via GitLab ESTG
1. Aceder a https://gitlab.estg.ipp.pt
2. Fazer login com credenciais ESTG
3. Novo Projeto > Novo projeto em branco
4. Preencher conforme acima

### 2. Adicionar Docentes como Reporters

1. No repositório, ir a **Configurações** > **Membros**
2. Clicar em **Convidar membros**
3. Adicionar:
   - Email: cfpa@estq.ipp.pt (Carlos Aldeias)
   - Email: jmt@estq.ipp.pt (José Teixeira)
4. Defin permissão: **Reporter**
5. Clicar "Adicionar"

### 3. Inicializar Repositório Local

```bash
# Entrar na pasta do projeto
cd /caminho/para/PetFinderApp

# Inicializar git
git init

# Adicionar todos os ficheiros
git add .

# Commit inicial
git commit -m "Initial commit: Pet Finder App structure"

# Adicionar remote (substituir URL)
git remote add origin https://gitlab.com/seu-usuario/petfinderapp.git
# OU
git remote add origin https://gitlab.estg.ipp.pt/seu-username/petfinderapp.git

# Fazer push para master/main
git branch -M main
git push -u origin main
```

### 4. Convenções de Commit

Usar padrão consistente:

```
feat: Adicionar nova funcionalidade
fix: Corrigir bug
docs: Atualizar documentação
style: Formatação de código
refactor: Reorganizar código
test: Adicionar/atualizar testes
chore: Tarefas administrativas
```

**Exemplos:**
```bash
git commit -m "feat: Implementar filtros de animais"
git commit -m "fix: Corrigir erro na autenticação API"
git commit -m "docs: Atualizar README com instruções"
git commit -m "refactor: Organizar estrutura de ViewControllers"
```

### 5. Workflow Recomendado

#### Para cada funcionalidade:

1. **Criar branch**
```bash
git checkout -b feature/nome-da-funcionalidade
```

2. **Trabalhar localmente**
```bash
# Fazer alterações...
git add ficheiros-alterados
git commit -m "feat: descrição da alteração"
```

3. **Push e Merge Request**
```bash
git push origin feature/nome-da-funcionalidade
```
Depois, no GitLab, criar Pull Request / Merge Request

4. **Merge para main**
Após revisão, fazer merge e eliminar branch

### 6. Atualizar Repositório

```bash
# Pull das alterações remotas
git pull origin main

# Ver status
git status

# Ver histórico
git log --oneline
```

### 7. Estrutura de Branches Recomendada

```
main/master                 # Versão estável
├── develop                 # Desenvolvimento
│   ├── feature/api         # Funcionalidades
│   ├── feature/ui
│   ├── feature/cache
│   ├── feature/notifications
│   ├── feature/achievements
│   ├── bugfix/auth-error   # Correções
│   └── hotfix/critical
```

### 8. Checklist para Commits

Antes de fazer commit:

- [ ] Código compila sem erros
- [ ] Testes passam
- [ ] Sem código comentado desnecessário
- [ ] Segue as convenções do projeto
- [ ] Mensagem de commit é clara e descritiva
- [ ] Não há dados sensíveis (API keys, passwords)

### 9. Proteger dados sensíveis

**NÃO fazer commit:**
- API Keys / Secrets
- Passwords
- Tokens
- Credenciais pessoais

**Solução:**
1. Criar ficheiro `.env` (não fazer commit)
2. Ou usar `.gitignore` para excluir ficheiros sensíveis

**Exemplo `.gitignore`:**
```
# Xcode
build/
*.xcarchive
*.app

# CocoaPods
Pods/
Podfile.lock

# IDE
.vscode/
.idea/

# Sensível
Secrets.plist
.env
API_KEYS.swift

# Sistema
.DS_Store
```

### 10. Colaboração em Grupo

#### Cada membro deve:
1. Fazer clone do repositório
```bash
git clone https://gitlab.estg.ipp.pt/seu-username/petfinderapp.git
cd petfinderapp
```

2. Configurar identidade
```bash
git config user.name "Seu Nome"
git config user.email "seu.email@example.com"
```

3. Trabalhar em branches separadas
4. Documentar contribuição individual
5. Fazer merge requests para revisão

### 11. Análise de Contribuição Individual

Cada membro consegue ver suas contribuições:

```bash
# Ver commits de um utilizador
git log --author="Nome do Autor" --oneline

# Ver estatísticas
git log --stat
git shortlog -s -n

# Ver quem alterou cada linha
git blame ficheiro.swift
```

### 12. Submissão M1 e M2

**Antes de cada entrega:**

1. Certificar que está tudo em GitLab
```bash
git status  # Deve estar limpo
git log --oneline  # Ver histórico
```

2. Criar tag de release
```bash
git tag -a M1 -m "Milestone 1"
git push origin M1

# Para M2:
git tag -a M2 -m "Milestone 2"
git push origin M2
```

3. Verificar acesso dos docentes
   - Ir a Settings > Members
   - Confirmar que cfpa@estq.ipp.pt e jmt@estq.ipp.pt têm permissão

4. Submeter link no Moodle
```
https://gitlab.estg.ipp.pt/seu-username/petfinderapp
```

### 13. Recursos Úteis

- [Git Documentation](https://git-scm.com/doc)
- [GitLab Documentation](https://docs.gitlab.com/)
- [Git Branching Strategy](https://git-flow.readthedocs.io/)
- [Commit Message Guide](https://www.conventionalcommits.org/)

---

**Importante**: Fazer commits pequenos e frequentes!
