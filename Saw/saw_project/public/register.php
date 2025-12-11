<?php
require_once '../config/config.php';
require_once '../includes/security.php';

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar CSRF Token
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $errors[] = "Token de segurança inválido.";
    } else {
        // Validar inputs
        $name = sanitize_input($_POST['name'] ?? '');
        $email = sanitize_input($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirm_password = $_POST['confirm_password'] ?? '';
        $phone = sanitize_input($_POST['phone'] ?? '');
        $address = sanitize_input($_POST['address'] ?? '');
        
        if (empty($name) || strlen($name) < 3) {
            $errors[] = "Nome deve ter pelo menos 3 caracteres.";
        }
        
        if (!validate_email($email)) {
            $errors[] = "Email inválido.";
        }
        
        if (strlen($password) < 8) {
            $errors[] = "Password deve ter pelo menos 8 caracteres.";
        }
        
        if ($password !== $confirm_password) {
            $errors[] = "As passwords não coincidem.";
        }
        
        // Verificar se email já existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $errors[] = "Este email já está registado.";
        }
        
        if (empty($errors)) {
            try {
                $hashed_password = hash_password($password);
                $stmt = $pdo->prepare("INSERT INTO users (name, email, password, phone, address, user_type) VALUES (?, ?, ?, ?, ?, 'user')");
                $stmt->execute([$name, $email, $hashed_password, $phone, $address]);
                
                log_activity($pdo->lastInsertId(), 'Registo de novo utilizador');
                
                $success = "Registo efetuado com sucesso! Pode fazer login.";
                header("refresh:2;url=login.php");
            } catch (PDOException $e) {
                $errors[] = "Erro ao registar utilizador. Por favor, tente novamente.";
                error_log("Erro no registo: " . $e->getMessage());
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
    <title>Registo - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <div class="form-container">
            <h1>Criar Conta</h1>
            
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
            
            <form method="POST" action="" class="form">
                <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
                
                <div class="form-group">
                    <label for="name">Nome Completo *</label>
                    <input type="text" id="name" name="name" required 
                           value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>" 
                           minlength="3" maxlength="100">
                </div>
                
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" required 
                           value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" 
                           maxlength="150">
                </div>
                
                <div class="form-group">
                    <label for="phone">Telefone</label>
                    <input type="tel" id="phone" name="phone" 
                           value="<?php echo htmlspecialchars($_POST['phone'] ?? ''); ?>" 
                           maxlength="20" pattern="[0-9+\s\-()]+">
                </div>
                
                <div class="form-group">
                    <label for="address">Morada</label>
                    <textarea id="address" name="address" rows="3" maxlength="255"><?php echo htmlspecialchars($_POST['address'] ?? ''); ?></textarea>
                </div>
                
                <div class="form-group">
                    <label for="password">Password *</label>
                    <input type="password" id="password" name="password" required 
                           minlength="8" maxlength="255">
                    <small>Mínimo 8 caracteres</small>
                </div>
                
                <div class="form-group">
                    <label for="confirm_password">Confirmar Password *</label>
                    <input type="password" id="confirm_password" name="confirm_password" required 
                           minlength="8" maxlength="255">
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">Registar</button>
            </form>
            
            <p class="text-center mt-3">
                Já tem conta? <a href="login.php">Fazer Login</a>
            </p>
        </div>
    </main>
    
    <?php include '../includes/footer.php'; ?>
</body>
</html>
