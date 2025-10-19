# 🎮 Game Store Backend API

Backend completo para loja de jogos com integração das APIs RAWG e CheapShark.

## 📋 Características

### Sistema de Utilizadores

- ✅ Registo e autenticação com JWT
- ✅ Perfis de permissões: User, Admin, Owner
- ✅ Verificação de idade (18+) para conteúdo explícito
- ✅ Gestão de definições de privacidade
- ✅ Biblioteca pessoal de jogos
- ✅ Wishlist
- ✅ Carrinho de compras

### Sistema de Jogos

- ✅ Integração com RAWG API para catálogo de jogos
- ✅ Integração com CheapShark API para preços
- ✅ Homepage com jogos recentes, populares e melhor avaliados
- ✅ Sistema de pesquisa avançada
- ✅ Ratings e comentários de utilizadores
- ✅ Proteção de conteúdo +18

### Sistema de Compras

- ✅ Compra individual ou por carrinho
- ✅ Histórico de transações
- ✅ Múltiplos métodos de pagamento

### Painel Administrativo

- ✅ Gestão de utilizadores
- ✅ Gestão de jogos
- ✅ Estatísticas da plataforma
- ✅ Sistema hierárquico (Admin < Owner)

## 🚀 Instalação

### Pré-requisitos

- Node.js 14+
- MongoDB 4.4+

### Passos

1. **Clone o repositório**

```bash
git clone <seu-repositorio>
cd game-store-backend
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o ficheiro `.env` com as suas configurações:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/game_store
JWT_SECRET=seu_secret_muito_seguro_aqui
RAWG_API_KEY=946dfd8d87af4f7fab2bd106dee9d019
OWNER_EMAIL=owner@gamestore.com
OWNER_PASSWORD=SuaPasswordSegura123!
```

4. **Crie a conta Owner**

```bash
node src/scripts/seedOwner.js
```

5. **Inicie o servidor**

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Documentação da API

### Base URL

```
http://localhost:5000/api
```

### Autenticação

Todas as rotas protegidas requerem o header:

```
Authorization: Bearer <seu_token_jwt>
```

---

## 🔐 AUTH Routes (`/api/auth`)

### 1. Registar Utilizador

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "Password123!",
  "dateOfBirth": "1995-05-15"
}
```

**Resposta (201):**

```json
{
  "success": true,
  "message": "Conta criada com sucesso",
  "data": {
    "user": {
      "id": "...",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "user",
      "isAdult": true,
      "age": 28
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "Password123!"
}
```

### 3. Obter Perfil Atual

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 4. Atualizar Perfil

```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "João Pedro Silva",
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}
```

### 5. Atualizar Definições

```http
PUT /api/auth/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "showExplicitContent": true,
  "newsletter": false
}
```

---

## 👤 USER Routes (`/api/users`)

### 1. Obter Biblioteca

```http
GET /api/users/library
Authorization: Bearer <token>
```

### 2. Obter Wishlist

```http
GET /api/users/wishlist
Authorization: Bearer <token>
```

### 3. Adicionar à Wishlist

```http
POST /api/users/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "gameId": 3498,
  "gameName": "Grand Theft Auto V"
}
```

### 4. Remover da Wishlist

```http
DELETE /api/users/wishlist/:gameId
Authorization: Bearer <token>
```

### 5. Obter Carrinho

```http
GET /api/users/cart
Authorization: Bearer <token>
```

### 6. Adicionar ao Carrinho

```http
POST /api/users/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "gameId": 3498,
  "gameName": "Grand Theft Auto V",
  "price": 29.99
}
```

### 7. Remover do Carrinho

```http
DELETE /api/users/cart/:gameId
Authorization: Bearer <token>
```

### 8. Limpar Carrinho

```http
DELETE /api/users/cart
Authorization: Bearer <token>
```

---

## 🎮 GAME Routes (`/api/games`)

### 1. Homepage (Jogos em Destaque)

```http
GET /api/games/homepage
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "recent": [...],
    "popular": [...],
    "topRated": [...]
  }
}
```

### 2. Pesquisar Jogos

```http
GET /api/games/search?search=gta&page=1&limit=20&sortBy=-rating
```

**Query Parameters:**

- `search`: Termo de pesquisa
- `page`: Número da página (default: 1)
- `limit`: Jogos por página (default: 20)
- `sortBy`: Ordenação (-released, -rating, -price.amount)

### 3. Detalhes do Jogo

```http
GET /api/games/:gameId
```

### 4. Avaliar Jogo

```http
POST /api/games/:gameId/rating
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Jogo incrível! Recomendo."
}
```

**Nota:** Apenas utilizadores que possuem o jogo podem avaliar.

### 5. Obter Avaliações do Jogo

```http
GET /api/games/:gameId/ratings?page=1&limit=10
```

---

## 💰 PURCHASE Routes (`/api/purchase`)

### 1. Checkout do Carrinho

```http
POST /api/purchase/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "credit_card"
}
```

**Métodos de pagamento aceites:**

- `credit_card`
- `debit_card`
- `paypal`
- `bank_transfer`

### 2. Comprar Jogo Individual

```http
POST /api/purchase/game/:gameId
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "credit_card"
}
```

### 3. Histórico de Transações

```http
GET /api/purchase/history?page=1&limit=10
Authorization: Bearer <token>
```

### 4. Detalhes de Transação

```http
GET /api/purchase/transaction/:transactionId
Authorization: Bearer <token>
```

---

## 👨‍💼 ADMIN Routes (`/api/admin`)

**Nota:** Requer role `admin` ou `owner`

### 1. Estatísticas Gerais

```http
GET /api/admin/stats
Authorization: Bearer <token>
```

### 2. Listar Utilizadores

```http
GET /api/admin/users?page=1&limit=20&role=user&isActive=true&search=joão
Authorization: Bearer <token>
```

### 3. Obter Utilizador

```http
GET /api/admin/users/:userId
Authorization: Bearer <token>
```

### 4. Atualizar Utilizador

```http
PUT /api/admin/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Novo Nome",
  "isActive": false,
  "role": "admin"
}
```

**Nota:** Apenas Owner pode alterar roles para owner.

### 5. Ativar/Desativar Utilizador

```http
PATCH /api/admin/users/:userId/toggle-active
Authorization: Bearer <token>
```

### 6. Eliminar Utilizador

```http
DELETE /api/admin/users/:userId
Authorization: Bearer <token>
```

**Nota:** Apenas Owner pode eliminar utilizadores.

### 7. Listar Jogos

```http
GET /api/admin/games?page=1&limit=20&isActive=true&isExplicit=false
Authorization: Bearer <token>
```

### 8. Atualizar Jogo

```http
PUT /api/admin/games/:gameId
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false,
  "isExplicit": true,
  "price": {
    "amount": 39.99,
    "onSale": true,
    "salePrice": 29.99
  }
}
```

### 9. Ativar/Desativar Jogo

```http
PATCH /api/admin/games/:gameId/toggle-active
Authorization: Bearer <token>
```

### 10. Eliminar Avaliação de Jogo

```http
DELETE /api/admin/games/:gameId/ratings/:ratingId
Authorization: Bearer <token>
```

---

## 🔒 Sistema de Permissões

### Hierarquia de Roles

```
Owner > Admin > User
```

### User (Utilizador Normal)

- ✅ Ver jogos (respeitando restrições +18)
- ✅ Comprar jogos
- ✅ Gerir carrinho e wishlist
- ✅ Avaliar jogos comprados
- ✅ Gerir perfil pessoal

### Admin

- ✅ Todas as permissões de User
- ✅ Gerir utilizadores (exceto Owner)
- ✅ Gerir jogos
- ✅ Ver estatísticas
- ❌ Não pode eliminar utilizadores
- ❌ Não pode alterar/criar Owners

### Owner

- ✅ Todas as permissões de Admin
- ✅ Eliminar utilizadores
- ✅ Criar/alterar Admins
- ✅ Acesso total ao sistema
- ⚠️ **Apenas 1 conta Owner permitida**

---

## 🔞 Sistema de Proteção de Conteúdo +18

### Requisitos

1. Utilizador deve ter 18+ anos (verificado no registo)
2. Utilizador deve ativar "showExplicitContent" nas definições

### Comportamento

- Jogos com ESRB "Mature" ou "Adults Only" são marcados como explícitos
- Utilizadores <18 nunca veem conteúdo explícito
- Utilizadores 18+ devem ativar nas definições
- Homepage, pesquisa e detalhes respeitam estas regras

---

## 🛠️ Estrutura do Projeto

```
game-store-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── gameController.js
│   │   ├── purchaseController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Game.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── gameRoutes.js
│   │   ├── purchaseRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── rawgService.js
│   │   └── cheapSharkService.js
│   ├── scripts/
│   │   └── seedOwner.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🧪 Testes

```bash
npm test
```

---

## 📝 Notas Importantes

### Segurança

- Passwords são encriptadas com bcrypt
- JWT tokens expiram em 7 dias (configurável)
- Rate limiting ativo (100 requests/15min)
- Helmet para headers de segurança
- CORS configurável

### APIs Externas

- **RAWG API**: Catálogo de jogos, detalhes, screenshots
- **CheapShark API**: Preços e deals
- Fallback para preços quando CheapShark não tem dados

### Performance

- Índices MongoDB para pesquisas rápidas
- Compression ativo
- Paginação em todas as listagens

---

## 🐛 Troubleshooting

### MongoDB não conecta

```bash
# Verifique se MongoDB está a correr
sudo systemctl status mongod

# Inicie se necessário
sudo systemctl start mongod
```

### Erro "Owner já existe"

```bash
# Normal se já executou o seed
# Para recriar, elimine primeiro da BD ou use outra BD
```

### Token inválido

- Verifique se o JWT_SECRET é o mesmo
- Token pode ter expirado (7 dias)
- Faça login novamente

---

## 📄 Licença

ISC

---

## 👨‍💻 Autor

Desenvolvido para um sistema completo de loja de jogos.

---

## 🔄 Próximas Features (Sugestões)

- [ ] Sistema de cupões de desconto
- [ ] Sistema de reviews com imagens
- [ ] Notificações por email
- [ ] Sistema de amigos
- [ ] Achievements/Conquistas
- [ ] Suporte multi-idioma
- [ ] Integração com mais APIs de preços
- [ ] Sistema de reembolso
- [ ] Chat de suporte
