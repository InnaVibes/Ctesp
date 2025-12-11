# 🎮 Backend LP Games - Fixed & Complete

## ✅ Correções Implementadas

### 1. **Modelos (Models)**
- ✅ Todos os campos convertidos de português para inglês
- ✅ `nome` → `name`
- ✅ `telefone` → `phone`
- ✅ Virtual `age` implementado com cálculo correto
- ✅ Virtual `isAdult` implementado (18+)
- ✅ Método `comparePassword()` implementado no User model
- ✅ Hash automático de password com bcrypt

### 2. **Validações (Validation)**
- ✅ Validação de formato de email
- ✅ Validação de password forte:
  - Mínimo 8 caracteres
  - Pelo menos 1 letra maiúscula
  - Pelo menos 1 letra minúscula
  - Pelo menos 1 número
  - Pelo menos 1 caractere especial
- ✅ Validação de formato de telefone (formato português)
- ✅ Validação de data de nascimento (idade mínima 13 anos)
- ✅ Validações para todos os endpoints

### 3. **Autenticação**
- ✅ Método `comparePassword()` utilizado no authController
- ✅ Sistema de autenticação robusto
- ✅ Middleware de autenticação corrigido
- ✅ Suporte para guests e utilizadores autenticados

### 4. **Conexão MongoDB**
- ✅ Conexão simplificada e robusta
- ✅ Tratamento de erros adequado
- ✅ Graceful shutdown implementado

### 5. **Rotas**
- ✅ Rota `/login` corrigida
- ✅ Todas as rotas com validações
- ✅ Mensagens de erro consistentes

## 🚀 Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# 3. Iniciar MongoDB
# Certifique-se que o MongoDB está rodando em localhost:27017

# 4. Iniciar servidor
npm run dev
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/game_store
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

## 🔐 Validações Implementadas

### Password
- ✅ Mínimo 8 caracteres
- ✅ Deve conter maiúscula
- ✅ Deve conter minúscula
- ✅ Deve conter número
- ✅ Deve conter caractere especial (!@#$%^&*...)

Exemplo de password válido: `MyPass123!`

### Email
- ✅ Formato válido (user@domain.com)
- ✅ Conversão automática para lowercase
- ✅ Verificação de duplicados

### Telefone
- ✅ Formato português: 9XXXXXXXX
- ✅ Com código: +351 9XXXXXXXX
- ✅ Internacional: 00351 9XXXXXXXX

### Data de Nascimento
- ✅ Formato ISO8601 (YYYY-MM-DD)
- ✅ Idade mínima: 13 anos
- ✅ Validação de data válida

## 📚 Endpoints Principais

### Autenticação
```
POST   /api/auth/register  - Registar cliente
POST   /api/auth/login     - Login
GET    /api/auth/me        - Perfil do utilizador
PUT    /api/auth/profile   - Atualizar perfil
PUT    /api/auth/settings  - Atualizar configurações
```

### Jogos
```
GET    /api/games/homepage       - Homepage com jogos em destaque
GET    /api/games/search         - Pesquisar jogos
GET    /api/games/:gameId        - Detalhes do jogo
POST   /api/games/:gameId/rating - Avaliar jogo (requer auth)
GET    /api/games/:gameId/ratings - Ver avaliações
```

### Utilizador
```
GET    /api/users/library   - Biblioteca de jogos
GET    /api/users/wishlist  - Lista de desejos
POST   /api/users/wishlist  - Adicionar à wishlist
DELETE /api/users/wishlist/:gameId - Remover da wishlist
GET    /api/users/cart      - Carrinho
POST   /api/users/cart      - Adicionar ao carrinho
DELETE /api/users/cart/:gameId - Remover do carrinho
```

### Compras
```
POST   /api/purchases/game/:gameId - Comprar jogo individual
POST   /api/purchases/checkout     - Finalizar carrinho
GET    /api/purchases/history      - Histórico de compras
```

## 🧪 Testar a API

### 1. Registar novo utilizador
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "MyPass123!",
    "dateOfBirth": "1995-06-15",
    "phone": "912345678"
  }'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "MyPass123!"
  }'
```

### 3. Obter perfil (com token)
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔒 Exemplos de Validação

### ✅ Password Válido
- `MyPass123!` ✓
- `Secure#2024` ✓
- `Test@1234` ✓

### ❌ Password Inválido
- `mypass123` (sem maiúscula e sem especial)
- `MYPASS123` (sem minúscula e sem especial)
- `MyPass` (muito curto)
- `MyPassword` (sem número e sem especial)

### ✅ Email Válido
- `user@example.com` ✓
- `joao.silva@company.pt` ✓

### ❌ Email Inválido
- `user@` ✗
- `@example.com` ✗
- `user.example.com` ✗

## 📊 Estrutura do Projeto

```
backend-lp-fixed-complete/
├── controllers/
│   ├── authController.js (✅ comparePassword implementado)
│   ├── gameController.js
│   ├── purchaseController.js
│   └── userController.js
├── middleware/
│   ├── auth.js (✅ Corrigido sem duplicação)
│   └── validation.js (✅ Todas validações)
├── models/
│   ├── user.js (✅ age, isAdult, comparePassword)
│   ├── admin.js (✅ Campos em inglês)
│   ├── client.js (✅ Campos em inglês)
│   ├── owner.js (✅ Campos em inglês)
│   ├── notification.js (✅ Campos em inglês)
│   └── Game.js
├── routes/
│   ├── authRoutes.js (✅ Com validações)
│   ├── login.js (✅ Corrigido)
│   ├── gamesRoutes.js
│   ├── purchaseRoutes.js
│   └── ...
├── services/
│   ├── rawgService.js
│   ├── cheapSharkService.js
│   └── emailService.js
├── .env.example
├── package.json
├── index.js (✅ Conexão MongoDB simplificada)
└── README.md
```

## 🐛 Erros Corrigidos

1. ✅ models/user.js - Métodos faltantes implementados
2. ✅ index.js - Conexão MongoDB simplificada
3. ✅ routes/login.js - Import correto do modelo User
4. ✅ middleware/auth.js - Duplicação removida
5. ✅ Validações completas adicionadas
6. ✅ Inconsistências de nomenclatura corrigidas
7. ✅ comparePassword usado no authController

## 🎯 Próximos Passos (Recomendado)

- [ ] Adicionar rate limiting (express-rate-limit)
- [ ] Implementar refresh tokens
- [ ] Adicionar testes unitários (Jest)
- [ ] Implementar logging profissional (Winston)
- [ ] Adicionar documentação Swagger/OpenAPI
- [ ] Configurar Docker
- [ ] Implementar CI/CD

## 📞 Suporte

Para questões ou problemas, consulte a documentação ou abra um issue.

## 📄 Licença

ISC

---

**Versão:** 2.0.0  
**Última atualização:** 10 Dezembro 2024
