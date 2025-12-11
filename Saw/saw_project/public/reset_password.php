<?php
require_once '../config/config.php';
require_once '../includes/security.php';

$errors = [];
$success = '';
$valid_token = false;
$token = $_GET['token'] ?? '';

// Verificar token
if ($token) {
    $stmt = $pdo->prepare("SELECT pr.*, u.email FROM password_resets pr 
                           JOIN users u ON pr.user_id = u.id 
                           WHERE pr.token = ? AND pr.expires_at > NOW() AND pr.used = FALSE");
    $stmt->execute([$token]);
    $reset = $stmt->fetch();
    
    if ($reset) {
        $valid_token = true;
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
                $errors[] = "Token de segurança inválido.";
            } else {
                $password = $_POST['password'] ?? '';
                $confirm_password = $_POST['confirm_password'] ?? '';
                
                if (strlen($password) < 8) {
                    $errors[] = "Password deve ter pelo menos 8 caracteres.";
                }
                
                if ($password !== $confirm_password) {
                    $errors[] = "As passwords não coincidem.";
                }
                
                if (empty($errors)) {
                    $hashed_password = hash_password($password);
                    
                    // Atualizar password
                    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                    $stmt->execute([$hashed_password, $reset['user_id']]);
                    
                    // Marcar token como usado
                    $stmt = $pdo->prepare("UPDATE password_resets SET used = TRUE WHERE id = ?");
                    $stmt->execute([$reset['id']]);
                    
                    // Limpar outros tokens do utilizador
                    $stmt = $pdo->prepare("DELETE FROM remember_tokens WHERE user_id = ?");
                    $stmt->execute([$reset['user_id']]);
                    
                    log_activity($reset['user_id'], 'Password alterada via recuperação');
                    
                    $success = "Password alterada com sucesso! A redirecionar para login...";
                    header("refresh:3;url=login.php");
                }
            }
        }
    } else {
        $errors[] = "Token inválido ou expirado.";
    }
} else {
    $errors[] = "Token não fornecido.";
}

$csrf_token = generate_csrf_token();
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Password - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <div class="form-container">
            <h1>Redefinir Password</h1>
            
            <?php if (!empty($errors)): ?>
                <div class="alert alert-error">
                    <ul>
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo htmlspecialchars($error); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
            
            <?php if ($success): ?>
                <div class="alert alert-success"><?php echo htmlspecialchars($success); ?></div>
            <?php endif; ?>
            
            <?php if ($valid_token && !$success): ?>
                <p>Email: <strong><?php echo htmlspecialchars($reset['email']); ?></strong></p>
                
                <form method="POST" action="" class="form">
                    <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
                    
                    <div class="form-group">
                        <label for="password">Nova Password</label>
                        <input type="password" id="password" name="password" required 
                               minlength="8" maxlength="255">
                        <small>Mínimo 8 caracteres</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm_password">Confirmar Password</label>
                        <input type="password" id="confirm_password" name="confirm_password" required 
                               minlength="8" maxlength="255">
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">Alterar Password</button>
                </form>
            <?php endif; ?>
            
            <p class="text-center mt-3">
                <a href="login.php">Voltar ao Login</a>
            </p>
        </div>
    </main>
    
    <?php include '../includes/footer.php'; ?>
</body>
</html>
