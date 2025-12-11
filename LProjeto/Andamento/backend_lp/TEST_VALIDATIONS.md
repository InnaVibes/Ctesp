# 🧪 Guia de Testes de Validação

## 📝 Como Testar as Validações

### 1. Teste de Registro com Password Fraco

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456",
    "dateOfBirth": "1995-01-01"
  }'
```

**Resultado Esperado**: ❌ Erro 400
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "msg": "Password must be at least 8 characters long",
      "param": "password"
    },
    {
      "msg": "Password must contain at least one uppercase letter",
      "param": "password"
    },
    {
      "msg": "Password must contain at least one special character",
      "param": "password"
    }
  ]
}
```

### 2. Teste de Registro com Password Forte

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "MyPass123!",
    "dateOfBirth": "1995-01-01"
  }'
```

**Resultado Esperado**: ✅ Sucesso 201
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "client",
      "isAdult": true,
      "age": 29
    },
    "token": "..."
  }
}
```

### 3. Teste de Email Inválido

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "password": "MyPass123!",
    "dateOfBirth": "1995-01-01"
  }'
```

**Resultado Esperado**: ❌ Erro 400
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "msg": "Invalid email format",
      "param": "email"
    }
  ]
}
```

### 4. Teste de Telefone Inválido

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test2@example.com",
    "password": "MyPass123!",
    "dateOfBirth": "1995-01-01",
    "phone": "123"
  }'
```

**Resultado Esperado**: ❌ Erro 400
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "msg": "Invalid phone number format (Portuguese format: 9XXXXXXXX or +351 9XXXXXXXX)",
      "param": "phone"
    }
  ]
}
```

### 5. Teste de Idade Mínima

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Child User",
    "email": "child@example.com",
    "password": "MyPass123!",
    "dateOfBirth": "2020-01-01"
  }'
```

**Resultado Esperado**: ❌ Erro 400
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "msg": "User must be at least 13 years old",
      "param": "dateOfBirth"
    }
  ]
}
```

### 6. Teste de Login com Credenciais Corretas

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "MyPass123!"
  }'
```

**Resultado Esperado**: ✅ Sucesso 200
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "client",
      "isAdult": true,
      "age": 29,
      "settings": {
        "showExplicitContent": false,
        "newsletter": false
      }
    },
    "token": "..."
  }
}
```

### 7. Teste de Login com Password Errado

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword123!"
  }'
```

**Resultado Esperado**: ❌ Erro 401
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## ✅ Checklist de Validações

### Password
- [x] Mínimo 8 caracteres
- [x] Pelo menos 1 maiúscula
- [x] Pelo menos 1 minúscula
- [x] Pelo menos 1 número
- [x] Pelo menos 1 caractere especial

### Email
- [x] Formato válido
- [x] Conversão para lowercase
- [x] Verificação de duplicados

### Telefone
- [x] Formato português válido
- [x] Aceita +351 ou 00351
- [x] Opcional (não obrigatório)

### Data de Nascimento
- [x] Formato ISO8601
- [x] Idade mínima 13 anos
- [x] Idade máxima 120 anos

### Nome
- [x] Mínimo 2 caracteres
- [x] Máximo 100 caracteres
- [x] Apenas letras e espaços

## 🎯 Exemplos de Dados Válidos

```json
{
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "password": "SecurePass123!",
  "dateOfBirth": "1995-06-15",
  "phone": "912345678"
}
```

```json
{
  "name": "Maria Santos",
  "email": "maria@company.pt",
  "password": "MyStr0ng#Pass",
  "dateOfBirth": "1990-03-20",
  "phone": "+351 918765432"
}
```

## ❌ Exemplos de Dados Inválidos

```json
{
  "name": "A",  // ❌ Muito curto
  "email": "invalid",  // ❌ Formato inválido
  "password": "weak",  // ❌ Password fraco
  "dateOfBirth": "2020-01-01",  // ❌ Muito jovem
  "phone": "123"  // ❌ Formato inválido
}
```

## 📊 Códigos de Status HTTP

- **200**: ✅ Sucesso
- **201**: ✅ Criado com sucesso
- **400**: ❌ Erro de validação
- **401**: ❌ Não autenticado
- **403**: ❌ Acesso negado
- **404**: ❌ Não encontrado
- **500**: ❌ Erro do servidor

## 🔐 Teste do comparePassword

O método `comparePassword()` é testado automaticamente quando você faz login.  
Se o login funcionar, significa que o `comparePassword()` está funcionando corretamente.

### Verificar se password é hasheado corretamente:

1. Criar utilizador via POST /api/auth/register
2. Verificar na BD se o password está hasheado (começa com $2b$)
3. Fazer login com password original
4. Se login funcionar, hash e compare estão OK

```bash
# No MongoDB shell
db.users.findOne({email: "test@example.com"}, {password: 1})

# Resultado esperado:
{
  "_id": ObjectId("..."),
  "password": "$2b$10$..." // ✅ Hasheado
}
```

---

**Dica**: Use o Postman ou Insomnia para facilitar os testes!
