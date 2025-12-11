<?php
// Configurações de Segurança
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0);
ini_set('session.cookie_samesite', 'Strict');

session_start();

// Regenerar ID de sessão periodicamente
if (!isset($_SESSION['created'])) {
    $_SESSION['created'] = time();
} else if (time() - $_SESSION['created'] > 1800) {
    session_regenerate_id(true);
    $_SESSION['created'] = time();
}

// Configurações do Site
define('SITE_NAME', 'Stand Automóvel Premium');
define('SITE_URL', 'http://localhost/saw_project');
define('UPLOAD_PATH', __DIR__ . '/../public/uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB

// Configurações de Email (para recuperação de senha)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'novo@gmail.com');
define('SMTP_PASS', 'senha123');
define('SMTP_FROM', 'noreply@standautomovel.pt');

// Timezone
date_default_timezone_set('Europe/Lisbon');

// Erros (desativar em produção)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir database
require_once __DIR__ . '/database.php';
?>
