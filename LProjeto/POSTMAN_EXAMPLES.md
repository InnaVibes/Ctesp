# 📮 Exemplos de Requests para Postman

## Configuração Inicial

### 1. Criar Environment no Postman

```
BASE_URL: http://localhost:5000
TOKEN: (será preenchido após login)
```

---

## 🎯 Fluxo Completo de Teste

### PASSO 1: Registar Novo Utilizador

**Request:**

```http
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "password": "Maria123!",
  "dateOfBirth": "1995-03-20"
}
```

**Guarde o `token` da resposta!**

---

### PASSO 2: Login

**Request:**

```http
POST {{BASE_URL}}/api/auth/login
Content-Type: application/json

{
  "email": "maria@example.com",
  "password": "Maria123!"
}
```

**Copie o token e adicione ao Environment do Postman como `TOKEN`**

---

### PASSO 3: Ver Homepage

**Request:**

```http
GET {{BASE_URL}}/api/games/homepage
```

**Sem autenticação necessária, mas se autenticado respeita definições +18**

---

### PASSO 4: Pesquisar Jogos

**Request:**

```http
GET {{BASE_URL}}/api/games/search?search=grand theft auto&page=1&limit=10
```

---

### PASSO 5: Ver Detalhes de um Jogo

**Request:**

```http
GET {{BASE_URL}}/api/games/3498
Authorization: Bearer {{TOKEN}}
```

**O ID 3498 é o GTA V na RAWG API**

---

### PASSO 6: Adicionar Jogo ao Carrinho

**Request:**

```http
POST {{BASE_URL}}/api/users/cart
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "gameId": 3498,
  "gameName": "Grand Theft Auto V",
  "price": 29.99
}
```

---

### PASSO 7: Ver Carrinho

**Request:**

```http
GET {{BASE_URL}}/api/users/cart
Authorization: Bearer {{TOKEN}}
```

---

### PASSO 8: Adicionar à Wishlist

**Request:**

```http
POST {{BASE_URL}}/api/users/wishlist
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "gameId": 3328,
  "gameName": "The Witcher 3: Wild Hunt"
}
```

---

### PASSO 9: Fazer Checkout

**Request:**

```http
POST {{BASE_URL}}/api/purchase/checkout
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "paymentMethod": "credit_card"
}
```

---

### PASSO 10: Ver Biblioteca

**Request:**

```http
GET {{BASE_URL}}/api/users/library
Authorization: Bearer {{TOKEN}}
```

---

### PASSO 11: Avaliar Jogo Comprado

**Request:**

```http
POST {{BASE_URL}}/api/games/3498/rating
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Jogo espetacular! História envolvente e gráficos incríveis. Recomendo muito!"
}
```

---

### PASSO 12: Ver Avaliações do Jogo

**Request:**

```http
GET {{BASE_URL}}/api/games/3498/ratings?page=1&limit=10
```

---

### PASSO 13: Atualizar Definições (Ativar Conteúdo +18)

**Request:**

```http
PUT {{BASE_URL}}/api/auth/settings
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "showExplicitContent": true,
  "newsletter": true
}
```

---

### PASSO 14: Ver Histórico de Compras

**Request:**

```http
GET {{BASE_URL}}/api/purchase/history?page=1&limit=10
Authorization: Bearer {{TOKEN}}
```

---

## 👨‍💼 Testes Admin

### PASSO 1: Login como Owner

**Primeiro execute o script:**

```bash
node src/scripts/seedOwner.js
```

**Depois faça login:**

```http
POST {{BASE_URL}}/api/auth/login
Content-Type: application/json

{
  "email": "owner@gamestore.com",
  "password": "ChangeThisPassword123!"
}
```

**Guarde este token como `ADMIN_TOKEN`**

---

### PASSO 2: Ver Estatísticas

**Request:**

```http
GET {{BASE_URL}}/api/admin/stats
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

### PASSO 3: Listar Todos os Utilizadores

**Request:**

```http
GET {{BASE_URL}}/api/admin/users?page=1&limit=20
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Com filtros:**

```http
GET {{BASE_URL}}/api/admin/users?role=user&isActive=true&search=maria
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

### PASSO 4: Ver Utilizador Específico

**Request:**

```http
GET {{BASE_URL}}/api/admin/users/USER_ID_AQUI
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

### PASSO 5: Promover Utilizador a Admin

**Request:**

```http
PUT {{BASE_URL}}/api/admin/users/USER_ID_AQUI
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "role": "admin"
}
```

**Nota: Apenas Owner pode alterar roles**

---

### PASSO 6: Desativar Utilizador

**Request:**

```http
PATCH {{BASE_URL}}/api/admin/users/USER_ID_AQUI/toggle-active
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

### PASSO 7: Listar Todos os Jogos

**Request:**

```http
GET {{BASE_URL}}/api/admin/games?page=1&limit=20
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Com filtros:**

```http
GET {{BASE_URL}}/api/admin/games?isActive=true&isExplicit=false
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

### PASSO 8: Atualizar Jogo (Marcar como +18)

**Request:**

```http
PUT {{BASE_URL}}/api/admin/games/3498
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{
  "isExplicit": true,
  "isActive": true,
  "price": {
    "amount": 39.99,
    "onSale": true,
    "salePrice": 29.99
  }
}
```

---

### PASSO 9: Desativar Jogo

**Request:**

```http
PATCH {{BASE_URL}}/api/admin/games/3498/toggle-active
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

### PASSO 10: Eliminar Avaliação Inapropriada

**Request:**

```http
DELETE {{BASE_URL}}/api/admin/games/3498/ratings/RATING_ID_AQUI
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

### PASSO 11: Eliminar Utilizador (Owner Only)

**Request:**

```http
DELETE {{BASE_URL}}/api/admin/users/USER_ID_AQUI
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Nota: Apenas Owner pode eliminar utilizadores**

---

## 🧪 Cenários de Teste

### Cenário 1: Utilizador Menor de Idade

**1. Registar com idade < 18:**

```json
{
  "name": "João Jovem",
  "email": "joao.jovem@example.com",
  "password": "Joao123!",
  "dateOfBirth": "2010-05-15"
}
```

**2. Tentar ativar conteúdo explícito:**

```http
PUT {{BASE_URL}}/api/auth/settings
Authorization: Bearer {{TOKEN}}

{
  "showExplicitContent": true
}
```

**Resultado esperado: ERRO 403 - Necessário ser maior de 18 anos**

**3. Tentar aceder a jogo +18:**

```http
GET {{BASE_URL}}/api/games/JOGO_EXPLICITO_ID
Authorization: Bearer {{TOKEN}}
```

**Resultado esperado: ERRO 403 ou jogo não aparece em pesquisas**

---

### Cenário 2: Admin Tentando Alterar Owner

**1. Login como Admin**

**2. Tentar alterar role do Owner:**

```http
PUT {{BASE_URL}}/api/admin/users/OWNER_USER_ID
Authorization: Bearer {{ADMIN_TOKEN}}

{
  "role": "user"
}
```

**Resultado esperado: ERRO 403 - Apenas Owner pode alterar conta Owner**

**3. Tentar promover-se a Owner:**

```http
PUT {{BASE_URL}}/api/admin/users/MEU_USER_ID
Authorization: Bearer {{ADMIN_TOKEN}}

{
  "role": "owner"
}
```

**Resultado esperado: ERRO 403 - Apenas Owner pode criar contas Owner**

---

### Cenário 3: Avaliar Jogo Sem Possuí-lo

**1. Tentar avaliar jogo não comprado:**

```http
POST {{BASE_URL}}/api/games/3498/rating
Authorization: Bearer {{TOKEN}}

{
  "rating": 5,
  "comment": "Tentando avaliar sem comprar"
}
```

**Resultado esperado: ERRO 403 - Necessário possuir o jogo para avaliar**

---

### Cenário 4: Compra Duplicada

**1. Comprar jogo:**

```http
POST {{BASE_URL}}/api/purchase/game/3498
Authorization: Bearer {{TOKEN}}

{
  "paymentMethod": "credit_card"
}
```

**2. Tentar comprar novamente:**

```http
POST {{BASE_URL}}/api/purchase/game/3498
Authorization: Bearer {{TOKEN}}

{
  "paymentMethod": "credit_card"
}
```

**Resultado esperado: ERRO 400 - Já possui este jogo na biblioteca**

---

### Cenário 5: Carrinho Vazio

**1. Tentar checkout com carrinho vazio:**

```http
POST {{BASE_URL}}/api/purchase/checkout
Authorization: Bearer {{TOKEN}}

{
  "paymentMethod": "credit_card"
}
```

**Resultado esperado: ERRO 400 - Carrinho está vazio**

---

## 📊 Coleção Completa para Importar no Postman

### Game Store API.postman_collection.json

```json
{
  "info": {
    "name": "Game Store API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!\",\n  \"dateOfBirth\": \"1995-01-01\"\n}"
            },
            "url": "{{BASE_URL}}/api/auth/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!\"\n}"
            },
            "url": "{{BASE_URL}}/api/auth/login"
          }
        },
        {
          "name": "Get Me",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{TOKEN}}" }],
            "url": "{{BASE_URL}}/api/auth/me"
          }
        },
        {
          "name": "Update Profile",
          "request": {
            "method": "PUT",
            "header": [
              { "key": "Authorization", "value": "Bearer {{TOKEN}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Updated Name\"\n}"
            },
            "url": "{{BASE_URL}}/api/auth/profile"
          }
        },
        {
          "name": "Update Settings",
          "request": {
            "method": "PUT",
            "header": [
              { "key": "Authorization", "value": "Bearer {{TOKEN}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"showExplicitContent\": true,\n  \"newsletter\": false\n}"
            },
            "url": "{{BASE_URL}}/api/auth/settings"
          }
        }
      ]
    },
    {
      "name": "Games",
      "item": [
        {
          "name": "Homepage",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/api/games/homepage"
          }
        },
        {
          "name": "Search Games",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/api/games/search?search=gta&page=1&limit=20"
          }
        },
        {
          "name": "Game Details",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/api/games/3498"
          }
        },
        {
          "name": "Add Rating",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{TOKEN}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"rating\": 5,\n  \"comment\": \"Amazing game!\"\n}"
            },
            "url": "{{BASE_URL}}/api/games/3498/rating"
          }
        },
        {
          "name": "Get Ratings",
          "request": {
            "method": "GET",
            "url": "{{BASE_URL}}/api/games/3498/ratings?page=1&limit=10"
          }
        }
      ]
    },
    {
      "name": "User",
      "item": [
        {
          "name": "Get Library",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{TOKEN}}" }],
            "url": "{{BASE_URL}}/api/users/library"
          }
        },
        {
          "name": "Get Wishlist",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{TOKEN}}" }],
            "url": "{{BASE_URL}}/api/users/wishlist"
          }
        },
        {
          "name": "Add to Wishlist",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{TOKEN}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"gameId\": 3498,\n  \"gameName\": \"Grand Theft Auto V\"\n}"
            },
            "url": "{{BASE_URL}}/api/users/wishlist"
          }
        },
        {
          "name": "Get Cart",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{TOKEN}}" }],
            "url": "{{BASE_URL}}/api/users/cart"
          }
        },
        {
          "name": "Add to Cart",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{TOKEN}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"gameId\": 3498,\n  \"gameName\": \"Grand Theft Auto V\",\n  \"price\": 29.99\n}"
            },
            "url": "{{BASE_URL}}/api/users/cart"
          }
        }
      ]
    },
    {
      "name": "Purchase",
      "item": [
        {
          "name": "Checkout Cart",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{TOKEN}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"paymentMethod\": \"credit_card\"\n}"
            },
            "url": "{{BASE_URL}}/api/purchase/checkout"
          }
        },
        {
          "name": "Purchase Single Game",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Authorization", "value": "Bearer {{TOKEN}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"paymentMethod\": \"credit_card\"\n}"
            },
            "url": "{{BASE_URL}}/api/purchase/game/3498"
          }
        },
        {
          "name": "Transaction History",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{TOKEN}}" }],
            "url": "{{BASE_URL}}/api/purchase/history"
          }
        }
      ]
    },
    {
      "name": "Admin",
      "item": [
        {
          "name": "Get Stats",
          "request": {
            "method": "GET",
            "header": [
              { "key": "Authorization", "value": "Bearer {{ADMIN_TOKEN}}" }
            ],
            "url": "{{BASE_URL}}/api/admin/stats"
          }
        },
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [
              { "key": "Authorization", "value": "Bearer {{ADMIN_TOKEN}}" }
            ],
            "url": "{{BASE_URL}}/api/admin/users"
          }
        },
        {
          "name": "Update User",
          "request": {
            "method": "PUT",
            "header": [
              { "key": "Authorization", "value": "Bearer {{ADMIN_TOKEN}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"role\": \"admin\",\n  \"isActive\": true\n}"
            },
            "url": "{{BASE_URL}}/api/admin/users/USER_ID"
          }
        },
        {
          "name": "Get All Games",
          "request": {
            "method": "GET",
            "header": [
              { "key": "Authorization", "value": "Bearer {{ADMIN_TOKEN}}" }
            ],
            "url": "{{BASE_URL}}/api/admin/games"
          }
        },
        {
          "name": "Update Game",
          "request": {
            "method": "PUT",
            "header": [
              { "key": "Authorization", "value": "Bearer {{ADMIN_TOKEN}}" },
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"isActive\": true,\n  \"isExplicit\": false\n}"
            },
            "url": "{{BASE_URL}}/api/admin/games/3498"
          }
        }
      ]
    }
  ]
}
```

---

## 🔍 Variáveis de Environment

### Game Store Environment.postman_environment.json

```json
{
  "name": "Game Store Environment",
  "values": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:5000",
      "enabled": true
    },
    {
      "key": "TOKEN",
      "value": "",
      "enabled": true
    },
    {
      "key": "ADMIN_TOKEN",
      "value": "",
      "enabled": true
    }
  ]
}
```

---

## 🎯 Scripts Úteis para Postman

### Auto-save Token após Login

Adicione este script no tab "Tests" do request de Login:

```javascript
// Auto-save token
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("TOKEN", jsonData.data.token);
  console.log("Token saved:", jsonData.data.token);
}
```

### Verificar Response Time

```javascript
pm.test("Response time is less than 2000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

### Verificar Status Code

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});
```

### Verificar Success True

```javascript
pm.test("Success is true", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.success).to.be.true;
});
```

---

## 📝 Notas Finais

1. **Importe os ficheiros JSON** no Postman para ter todas as requests prontas
2. **Configure as variáveis de environment** antes de começar
3. **Execute na ordem** dos cenários para melhores resultados
4. **Guarde os tokens** após login para usar nas próximas requests
5. **IDs dos jogos** podem ser encontrados na RAWG API ou ao fazer pesquisas

---

## 🎮 IDs de Jogos Populares para Testar

- **3498** - Grand Theft Auto V
- **3328** - The Witcher 3: Wild Hunt
- **4200** - Portal 2
- **5286** - Tomb Raider (2013)
- **12020** - Left 4 Dead 2
- **13536** - Portal
- **4291** - Counter-Strike: Global Offensive
- **5679** - The Elder Scrolls V: Skyrim
- **802** - Borderlands 2
- **28** - Red Dead Redemption 2
