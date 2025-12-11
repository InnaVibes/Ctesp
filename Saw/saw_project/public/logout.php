<?php
require_once '../config/config.php';
require_once '../includes/security.php';

if (is_logged_in()) {
    log_activity($_SESSION['user_id'], 'Logout');
    
    // Limpar remember me cookie se existir
    if (isset($_COOKIE['remember_token'])) {
        $stmt = $pdo->prepare("DELETE FROM remember_tokens WHERE token = ?");
        $stmt->execute([$_COOKIE['remember_token']]);
        
        setcookie('remember_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'secure' => false,
            'samesite' => 'Strict'
        ]);
    }
}

// Destruir sessão
session_unset();
session_destroy();

redirect(SITE_URL . '/public/index.php');
?>
