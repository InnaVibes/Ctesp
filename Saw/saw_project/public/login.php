<?php
require_once '../config/config.php';
require_once '../includes/security.php';

// Check Remember Me Token
if (!is_logged_in() && isset($_COOKIE['remember_token'])) {
    $token = $_COOKIE['remember_token'];
    $stmt = $pdo->prepare("SELECT rt.user_id, u.user_type FROM remember_tokens rt 
                           JOIN users u ON rt.user_id = u.id 
                           WHERE rt.token = ? AND rt.expires_at > NOW() AND u.is_active = TRUE");
    $stmt->execute([$token]);
    $result = $stmt->fetch();
    
    if ($result) {
        $_SESSION['user_id'] = $result['user_id'];
        $_SESSION['user_type'] = $result['user_type'];
        log_activity($result['user_id'], 'Login via Remember Me');
        
        if ($result['user_type'] === 'admin') {
            redirect(SITE_URL . '/admin/dashboard.php');
        } else {
            redirect(SITE_URL . '/user/dashboard.php');
        }
    }
}

if (is_logged_in()) {
    redirect(SITE_URL . '/public/index.php');
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Rate Limiting
    if (!check_rate_limit('login_attempts', 5, 300)) {
        $errors[] = "Demasiadas tentativas de login. Por favor, aguarde 5 minutos.";
    } else {
        if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
            $errors[] = "Token de segurança inválido.";
        } else {
            $email = sanitize_input($_POST['email'] ?? '');
            $password = $_POST['password'] ?? '';
            $remember = isset($_POST['remember']);
            
            if (!validate_email($email)) {
                $errors[] = "Email inválido.";
            }
            
            if (empty($errors)) {
                $stmt = $pdo->prepare("SELECT id, password, user_type, is_active FROM users WHERE email = ?");
                $stmt->execute([$email]);
                $user = $stmt->fetch();
                
                if ($user && verify_password($password, $user['password'])) {
                    if (!$user['is_active']) {
                        $errors[] = "Conta desativada. Contacte o administrador.";
                    } else {
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['user_type'] = $user['user_type'];
                       
                        // Remember Me
                        if ($remember) {
                            $token = generate_token();
                            $expires = date('Y-m-d H:i:s', strtotime('+30 days'));
                            
                            $stmt = $pdo->prepare("INSERT INTO remember_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
                            $stmt->execute([$user['id'], $token, $expires]);
                            
                            setcookie('remember_token', $token, [
                                'expires' => strtotime('+30 days'),
                                'path' => '/',
                                'httponly' => true,
                                'secure' => false, // Mudar para true em produção com HTTPS
                                'samesite' => 'Strict'
                            ]);
                        }
                        
                        log_activity($user['id'], 'Login');
                        
                        if ($user['user_type'] === 'admin') {
                            redirect(SITE_URL . '/admin/dashboard.php');
                        } else {
                            redirect(SITE_URL . '/user/dashboard.php');
                        }
                    }
                } else {
                    $errors[] = "Email ou password incorretos.";
                    if ($user) {
                        log_activity($user['id'], 'Tentativa de login falhada');
                    }
                }
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
    <title>Login - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <div class="form-container">
            <h1>Login</h1>
            
            <?php if (!empty($errors)): ?>
                <div class="alert alert-error">
                    <ul>
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo htmlspecialchars($error); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="" class="form">
                <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required 
                           value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <div class="form-group checkbox">
                    <input type="checkbox" id="remember" name="remember">
                    <label for="remember">Lembrar-me</label>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">Entrar</button>
            </form>
            
            <p class="text-center mt-3">
                <a href="forgot_password.php">Esqueceu a password?</a>
            </p>
            
            <p class="text-center">
                Não tem conta? <a href="register.php">Registar</a>
            </p>
            
            <div class="demo-credentials">
                <h3>Credenciais de Teste:</h3>
                <p><strong>Admin:</strong> admin@standautomovel.pt / admin123</p>
                <p><strong>User:</strong> joao.silva@email.pt / user123</p>
            </div>
        </div>
    </main>
    
    <?php include '../includes/footer.php'; ?>
</body>
</html>
