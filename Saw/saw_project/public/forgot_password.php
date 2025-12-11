<?php
require_once '../config/config.php';
require_once '../includes/security.php';

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $errors[] = "Token de segurança inválido.";
    } else {
        $email = sanitize_input($_POST['email'] ?? '');
        
        if (!validate_email($email)) {
            $errors[] = "Email inválido.";
        } else {
            // Verificar se o email existe
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if ($user) {
                // Gerar token de recuperação
                $token = generate_token();
                $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
                
                $stmt = $pdo->prepare("INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)");
                $stmt->execute([$user['id'], $token, $expires]);
                
                // Criar link de recuperação
                $reset_link = SITE_URL . "/public/reset_password.php?token=" . $token;
                
                // Em produção, enviar email aqui
                // Por agora, apenas mostrar mensagem
                log_activity($user['id'], 'Solicitação de recuperação de password');
                
                $success = "Instruções de recuperação foram enviadas para o seu email. Link: <a href='$reset_link'>$reset_link</a> (válido por 1 hora)";
            } else {
                // Por segurança, mostrar mesma mensagem mesmo se email não existe
                $success = "Se o email existir na nossa base de dados, receberá instruções de recuperação.";
            }
        }
    }
}

$csrf_token = generate_csrf_token();
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar Password - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <div class="form-container">
            <h1>Recuperar Password</h1>
            <p>Introduza o seu email para receber instruções de recuperação.</p>
            
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
                <div class="alert alert-success"><?php echo $success; ?></div>
            <?php endif; ?>
            
            <form method="POST" action="" class="form">
                <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required 
                           value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">Enviar</button>
            </form>
            
            <p class="text-center mt-3">
                <a href="login.php">Voltar ao Login</a>
            </p>
        </div>
    </main>
    
    <?php include '../includes/footer.php'; ?>
</body>
</html>
