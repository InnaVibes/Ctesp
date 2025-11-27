# Stand Automóvel - Sistema de Gestão

Trabalho Prático de Segurança em Aplicações Web
CTeSP - Cibersegurança, Redes e Sistemas Informáticos / Desenvolvimento para a Web e Dispositivos Móveis

## Requisitos do Sistema

- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Apache/Nginx com mod_rewrite
- Extensões PHP: PDO, pdo_mysql, gd, fileinfo

## Instalação

### 1. Configurar Base de Dados

```bash
# Aceder ao MySQL
mysql -u root -p

# Criar a base de dados
source database.sql
```

Ou importar via phpMyAdmin:
- Aceder a phpMyAdmin
- Criar nova base de dados: `stand_automovel`
- Importar o ficheiro `database.sql`

### 2. Configurar Aplicação

Editar o ficheiro `config/config.php` e ajustar as seguintes configurações:

```php
// Base de Dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'stand_automovel');
define('DB_USER', 'root');
define('DB_PASS', '');

// URL do Site (ajustar conforme necessário)
define('SITE_URL', 'http://localhost/saw_project');
```

### 3. Configurar Permissões

```bash
# Dar permissões de escrita às pastas de upload
chmod 755 -R public/uploads/
chown www-data:www-data -R public/uploads/ # Linux/Apache
```

### 4. Configurar Servidor Web

#### Apache (.htaccess)
O projeto já inclui ficheiros .htaccess necessários.

#### Nginx
Adicionar ao ficheiro de configuração:
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

## Estrutura do Projeto

```
saw_project/
├── admin/                  # Área de administração
│   ├── dashboard.php
│   ├── users.php
│   ├── vehicles.php
│   └── bookings.php
├── config/                 # Configurações
│   ├── config.php
│   └── database.php
├── includes/               # Ficheiros incluídos
│   ├── security.php
│   ├── header.php
│   └── footer.php
├── public/                 # Ficheiros públicos
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── uploads/           # Uploads de utilizadores
│   ├── index.php          # Página principal
│   ├── login.php
│   ├── register.php
│   ├── forgot_password.php
│   ├── reset_password.php
│   └── logout.php
├── user/                   # Área de utilizador
│   ├── dashboard.php
│   ├── profile.php
│   ├── vehicles.php
│   ├── vehicle_detail.php
│   └── my_bookings.php
└── database.sql           # Script SQL

```

## Credenciais de Teste

### Administrador
- Email: `admin@standautomovel.pt`
- Password: `admin123`

### Utilizadores
- Email: `joao.silva@email.pt`
- Password: `user123`

- Email: `maria.santos@email.pt`
- Password: `user123`

## Funcionalidades Implementadas

### Segurança

1. **Autenticação e Autorização**
   - Sistema de login com validação de credenciais
   - Passwords hash com bcrypt (cost 12)
   - Separação de permissões (Admin/User)
   - Proteção de rotas por tipo de utilizador

2. **Proteção CSRF**
   - Tokens CSRF em todos os formulários
   - Validação de tokens no servidor

3. **Remember Me Seguro**
   - Tokens únicos armazenados na base de dados
   - Expiração automática (30 dias)
   - Limpeza de tokens antigos

4. **Recuperação de Senha (Forgot Password)**
   - Tokens únicos com expiração (1 hora)
   - Tokens de uso único
   - Validação de expiração

5. **Validação de Dados**
   - Sanitização de todos os inputs
   - Validação de tipos de dados
   - Prepared Statements (PDO) em todas as queries
   - Validação de uploads de ficheiros

6. **Upload Seguro de Ficheiros**
   - Validação de tipo MIME
   - Validação de extensão
   - Limite de tamanho (5MB)
   - Nomes de ficheiro únicos
   - Verificação de tipo real do ficheiro

7. **Sessões Seguras**
   - HttpOnly cookies
   - SameSite=Strict
   - Regeneração periódica de session ID
   - Timeout de sessão

8. **Rate Limiting**
   - Limitação de tentativas de login
   - Proteção contra brute force

9. **Logging de Atividades**
   - Registo de ações importantes
   - Registo de IP
   - Auditoria de segurança

10. **Configurações de Segurança PHP**
    - display_errors desativado em produção
    - Configurações seguras de sessão
    - Tratamento de erros robusto

### Funcionalidades de Negócio

#### Área Pública
- Visualização de todos os veículos (sem estado)
- Registo de novos utilizadores
- Login com Remember Me
- Recuperação de senha

#### Área de Utilizador
- Dashboard personalizado
- Perfil editável com foto
- Alterar dados pessoais e password
- Consulta de veículos com filtros (Marca, Ano)
- Visualização detalhada de veículos
- Agendamento de test drives
- Verificação de disponibilidade de horários
- Listagem de todas as reservas realizadas

#### Área de Administração
- Dashboard com estatísticas
- Gestão de utilizadores
- Gestão completa de veículos (CRUD)
- Gestão de reservas de test drives
- Visualização de logs de atividade
- Perfil do administrador editável

### Validações Implementadas

1. **Validação de Email**: Filter_var com FILTER_VALIDATE_EMAIL
2. **Validação de Password**: Mínimo 8 caracteres
3. **Validação de Nome**: Mínimo 3 caracteres
4. **Validação de Telefone**: Padrão numérico
5. **Validação de Data**: Formato e validade
6. **Validação de Imagens**: Tipo, tamanho, extensão
7. **Validação de Reservas**: Disponibilidade de horário

### Sistema de Erros

- Try-catch em todas as operações críticas
- Logging de erros em ficheiro
- Mensagens de erro amigáveis ao utilizador
- Mensagens de erro técnicas em logs

## Configurações de Segurança

### Em Produção (Importante!)

1. Alterar no `config/config.php`:
```php
// Desativar exibição de erros
error_reporting(0);
ini_set('display_errors', 0);

// Ativar HTTPS
ini_set('session.cookie_secure', 1);
```

2. Configurar HTTPS no servidor
3. Alterar credenciais da base de dados
4. Configurar backup automático da base de dados
5. Configurar logs do servidor
6. Implementar firewall (ex: fail2ban)

### Boas Práticas Aplicadas

- Separação de código (MVC simplificado)
- Configurações centralizadas
- Código reutilizável (funções de segurança)
- Comentários no código
- Nomes de variáveis descritivos
- Prepared Statements obrigatórios
- Princípio do menor privilégio

## Melhorias Futuras (Opcional)

- Implementação de 2FA (Two-Factor Authentication)
- Captcha nos formulários
- Sistema de notificações por email
- Relatórios em PDF
- Exportação de dados
- API RESTful
- Versionamento de base de dados (migrations)
- Testes automatizados
- Sistema de cache
- Compressão de imagens automática

## Troubleshooting

### Erro de conexão à base de dados
- Verificar credenciais em `config/database.php`
- Confirmar que o MySQL está a correr
- Verificar se a base de dados existe

### Erro de permissões de ficheiros
```bash
chmod 755 -R public/uploads/
```

### Sessão não persiste
- Verificar permissões da pasta de sessões do PHP
- Verificar configurações de cookies no navegador

### Imagens não aparecem
- Verificar permissões da pasta uploads/
- Verificar se o caminho está correto no config.php

## Suporte

Para questões ou problemas:
- Consultar a documentação PHP: https://www.php.net/
- Consultar a documentação MySQL: https://dev.mysql.com/doc/
- Verificar logs de erro do servidor

## Autores

Trabalho desenvolvido para a disciplina de Segurança em Aplicações Web
ESTG - Instituto Politécnico do Porto

## Licença

Este projeto é para fins educacionais.
