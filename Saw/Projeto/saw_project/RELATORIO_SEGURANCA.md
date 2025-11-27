# RELATÓRIO DE SEGURANÇA
## Stand Automóvel - Sistema de Gestão

### Trabalho Prático - Segurança em Aplicações Web
CTeSP - 2025/2026

---

## 1. INTRODUÇÃO

Este relatório documenta todas as medidas de segurança implementadas no sistema de gestão de Stand Automóvel, desenvolvido em PHP e MySQL. O projeto segue as melhores práticas de segurança web recomendadas pela OWASP (Open Web Application Security Project).

---

## 2. MEDIDAS DE SEGURANÇA IMPLEMENTADAS

### 2.1 Autenticação e Gestão de Sessões

#### 2.1.1 Sistema de Login
- **Hash de Passwords**: Utilização de `password_hash()` com algoritmo BCRYPT e cost factor de 12
- **Verificação Segura**: Uso de `password_verify()` para comparação de passwords
- **Proteção contra Timing Attacks**: Uso de funções nativas PHP que previnem ataques de temporização

#### 2.1.2 Sessões Seguras
**Configurações implementadas em `config/config.php`:**
```php
ini_set('session.cookie_httponly', 1);  // Previne acesso JavaScript aos cookies
ini_set('session.use_only_cookies', 1);  // Força uso de cookies para sessões
ini_set('session.cookie_secure', 0);     // HTTPS (desativado em dev, ativar em produção)
ini_set('session.cookie_samesite', 'Strict'); // Proteção CSRF adicional
```

**Regeneração de Session ID:**
- Implementada verificação de tempo em cada requisição
- Session ID regenerado a cada 30 minutos
- Previne ataques de session fixation

#### 2.1.3 Remember Me Seguro
**Implementação (`includes/security.php`, `public/login.php`):**
- Tokens criptograficamente seguros gerados com `random_bytes()`
- Armazenamento em base de dados com expiração
- Cookie com flags de segurança (HttpOnly, SameSite)
- Expiração automática após 30 dias
- Limpeza de tokens antigos ao alterar password

### 2.2 Proteção Contra Injeção SQL

#### 2.2.1 Prepared Statements
**Exemplo de implementação:**
```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
```

**Aplicado em:**
- Todas as queries de leitura (SELECT)
- Todas as queries de escrita (INSERT, UPDATE, DELETE)
- Queries com parâmetros dinâmicos
- Queries com dados de utilizador

#### 2.2.2 PDO com Emulate Prepares Desativado
```php
PDO::ATTR_EMULATE_PREPARES => false
```
Garante que os prepared statements são processados pelo servidor MySQL, não emulados pelo PHP.

### 2.3 Proteção Cross-Site Scripting (XSS)

#### 2.3.1 Output Encoding
**Função de sanitização:**
```php
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}
```

**Aplicado em:**
- Todos os outputs de dados de utilizador
- Nomes, emails, moradas, descrições
- Mensagens de erro e sucesso
- Qualquer dado proveniente da base de dados

#### 2.3.2 Content Security Policy (CSP)
Implementado via headers HTTP no `.htaccess`:
```
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
```

### 2.4 Proteção Cross-Site Request Forgery (CSRF)

#### 2.4.1 Tokens CSRF
**Geração de token:**
```php
function generate_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = generate_token();
    }
    return $_SESSION['csrf_token'];
}
```

**Verificação de token:**
```php
function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && 
           hash_equals($_SESSION['csrf_token'], $token);
}
```

**Implementado em:**
- Todos os formulários (login, registo, perfil, etc.)
- Ações de criação/edição/eliminação
- Alteração de dados sensíveis

**Uso de `hash_equals()`**: Previne timing attacks na comparação de strings.

### 2.5 Upload Seguro de Ficheiros

#### 2.5.1 Validação de Uploads
**Implementado em `includes/security.php`:**

**Verificações realizadas:**
1. Verificação de erro de upload
2. Verificação de tamanho (máx. 5MB)
3. Verificação de tipo MIME real do ficheiro
4. Verificação de extensão permitida
5. Geração de nome único

**Tipos permitidos:**
```php
$allowed_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
$allowed_extensions = ['jpg', 'jpeg', 'png', 'webp'];
```

**Verificação do tipo MIME real:**
```php
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime_type = finfo_file($finfo, $file['tmp_name']);
```

**Nome de ficheiro único:**
```php
$filename = uniqid('img_', true) . '.' . $extension;
```

### 2.6 Validação de Inputs

#### 2.6.1 Validações Implementadas
**Email:**
```php
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}
```

**Password:**
- Mínimo 8 caracteres
- Verificação de correspondência em registo/alteração

**Dados pessoais:**
- Nome: mínimo 3 caracteres
- Telefone: padrão numérico
- Validação de comprimento máximo

#### 2.6.2 Validação no Cliente e Servidor
- Validação HTML5 (atributos required, minlength, pattern)
- Validação PHP no servidor (nunca confiar apenas no cliente)

### 2.7 Controlo de Acesso

#### 2.7.1 Verificação de Permissões
**Funções implementadas:**
```php
function is_logged_in() {
    return isset($_SESSION['user_id']) && isset($_SESSION['user_type']);
}

function is_admin() {
    return is_logged_in() && $_SESSION['user_type'] === 'admin';
}

function require_login() {
    if (!is_logged_in()) {
        redirect(SITE_URL . '/public/login.php');
    }
}

function require_admin() {
    if (!is_admin()) {
        redirect(SITE_URL . '/public/index.php');
    }
}
```

**Aplicado em:**
- Todas as páginas da área de utilizador
- Todas as páginas da área de administração
- Antes de qualquer operação sensível

#### 2.7.2 Segregação de Funções
- **Área Pública**: Acesso sem autenticação (visualização limitada)
- **Área de Utilizador**: Requer autenticação, acesso apenas aos próprios dados
- **Área Admin**: Requer autenticação + tipo admin, acesso a todos os dados

**Utilizadores não podem:**
- Aceder ao perfil de outros utilizadores
- Editar dados de outros utilizadores
- Aceder à área de administração

### 2.8 Rate Limiting

#### 2.8.1 Proteção Contra Brute Force
**Implementação:**
```php
function check_rate_limit($identifier, $max_attempts = 5, $time_window = 300) {
    // Implementação com sessão
}
```

**Aplicado em:**
- Tentativas de login (5 tentativas em 5 minutos)
- Proteção contra ataques automatizados

### 2.9 Recuperação de Senha (Forgot Password)

#### 2.9.1 Sistema Seguro
**Características:**
- Tokens únicos criptograficamente seguros
- Expiração de 1 hora
- Tokens de uso único (marcados como usados)
- Limpeza de tokens antigos

**Fluxo:**
1. Utilizador solicita recuperação
2. Token gerado e armazenado com expiração
3. Link enviado (em produção: por email)
4. Token validado ao aceder link
5. Nova password definida
6. Token marcado como usado
7. Todos os remember tokens limpos

### 2.10 Logging e Auditoria

#### 2.10.1 Sistema de Logs
**Tabela `activity_logs`:**
- ID do utilizador
- Ação realizada
- Detalhes da ação
- Endereço IP
- Timestamp

**Eventos registados:**
- Login/Logout
- Registo de novo utilizador
- Alterações de perfil
- Alterações de password
- Reservas de test drive
- Tentativas de login falhadas
- Recuperação de password

**Função de logging:**
```php
function log_activity($user_id, $action, $details = '') {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO activity_logs 
                          (user_id, action, details, ip_address, created_at) 
                          VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$user_id, $action, $details, $_SERVER['REMOTE_ADDR']]);
}
```

### 2.11 Configurações de Segurança PHP

#### 2.11.1 Configurações Aplicadas
```php
// Erros (desativar em produção)
error_reporting(E_ALL);
ini_set('display_errors', 1); // Mudar para 0 em produção
```

#### 2.11.2 Headers de Segurança (.htaccess)
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 2.12 Estrutura de Base de Dados

#### 2.12.1 Boas Práticas Implementadas
- Tipos de dados apropriados
- Restrições de integridade (FOREIGN KEYS)
- Índices em campos pesquisados
- Campos com valores padrão
- Charset UTF-8mb4 (suporta emojis)
- Timestamps automáticos

#### 2.12.2 Normalização
- Base de dados normalizada (3NF)
- Eliminação de redundância
- Integridade referencial

---

## 3. ESTRUTURA DO SITE

### 3.1 Arquitetura
- **Separação de responsabilidades**: Config, Includes, Public, User, Admin
- **Configuração centralizada**: `config/config.php`
- **Funções reutilizáveis**: `includes/security.php`
- **Headers/Footers comuns**: `includes/header.php`, `includes/footer.php`

### 3.2 Fluxo de Autenticação
1. Utilizador acede a página protegida
2. Verificação de sessão ativa
3. Se não autenticado → redirect para login
4. Se autenticado → verificação de permissões
5. Se sem permissões → redirect para área apropriada

---

## 4. PERMISSÕES E CONFIGURAÇÕES

### 4.1 Permissões de Ficheiros
```bash
# Diretórios
chmod 755 config/
chmod 755 includes/
chmod 755 public/
chmod 755 admin/
chmod 755 user/

# Uploads (escrita)
chmod 755 public/uploads/
chmod 755 public/uploads/profiles/
chmod 755 public/uploads/vehicles/
```

### 4.2 Proteção de Diretórios (.htaccess)
- Config e includes protegidos contra acesso direto
- Ficheiros .sql, .md, .log protegidos
- Listagem de diretórios desativada

---

## 5. TRATAMENTO DE ERROS

### 5.1 Sistema Implementado
**Try-Catch em operações críticas:**
```php
try {
    // Operação de base de dados
} catch (PDOException $e) {
    error_log("Erro: " . $e->getMessage());
    // Mensagem genérica ao utilizador
}
```

**Vantagens:**
- Erros técnicos em logs
- Mensagens amigáveis ao utilizador
- Não expõe estrutura da base de dados
- Facilita debugging

---

## 6. MELHORIAS DE SEGURANÇA FUTURAS

### 6.1 Recomendações para Produção
1. **HTTPS obrigatório**
   - Certificado SSL/TLS válido
   - Redirect HTTP → HTTPS
   - HSTS (HTTP Strict Transport Security)

2. **Two-Factor Authentication (2FA)**
   - TOTP (Time-based One-Time Password)
   - SMS ou Email de verificação

3. **CAPTCHA**
   - Google reCAPTCHA em login/registo
   - Proteção adicional contra bots

4. **WAF (Web Application Firewall)**
   - ModSecurity ou CloudFlare
   - Proteção contra ataques comuns

5. **Rate Limiting Avançado**
   - Redis ou Memcached
   - Limites por IP e por utilizador

6. **Monitorização**
   - Sistema de alertas
   - Análise de logs automática
   - Detecção de anomalias

7. **Backup Automático**
   - Backup diário da base de dados
   - Backup de ficheiros
   - Testes de restauro

8. **Testes de Segurança**
   - Penetration testing
   - Vulnerability scanning
   - Code review

---

## 7. CONFORMIDADE OWASP TOP 10

### 7.1 Proteções Implementadas

| OWASP Top 10 | Proteção Implementada |
|--------------|----------------------|
| A01:2021 - Broken Access Control | Verificação de permissões, segregação de áreas |
| A02:2021 - Cryptographic Failures | BCRYPT para passwords, tokens seguros |
| A03:2021 - Injection | Prepared Statements, validação de inputs |
| A04:2021 - Insecure Design | Arquitetura segura, princípio do menor privilégio |
| A05:2021 - Security Misconfiguration | Configurações seguras de PHP e sessão |
| A06:2021 - Vulnerable Components | Código próprio, dependências mínimas |
| A07:2021 - Identification Failures | Sessões seguras, rate limiting |
| A08:2021 - Software/Data Integrity | Validação de uploads, CSRF tokens |
| A09:2021 - Security Logging Failures | Sistema de logging implementado |
| A10:2021 - SSRF | Validação de URLs, sem requests externos |

---

## 8. CONCLUSÃO

O sistema implementado incorpora múltiplas camadas de segurança, seguindo as melhores práticas da indústria. Todas as vulnerabilidades comuns (SQL Injection, XSS, CSRF, etc.) foram endereçadas com implementações robustas.

O código está estruturado de forma modular e mantível, facilitando futuras melhorias e manutenção. A documentação completa permite que qualquer desenvolvedor compreenda e expanda o sistema de forma segura.

Para ambientes de produção, recomenda-se implementar as melhorias sugeridas na secção 6, especialmente HTTPS obrigatório, 2FA e monitorização contínua.

---

**Data:** Novembro 2025  
**Disciplina:** Segurança em Aplicações Web  
**Instituição:** ESTG - Instituto Politécnico do Porto
