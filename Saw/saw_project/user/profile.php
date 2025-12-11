<?php
require_once '../config/config.php';
require_once '../includes/security.php';

require_login();

$errors = [];
$success = '';

// Buscar dados do utilizador
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $errors[] = "Token de segurança inválido.";
    } else {
        $name = sanitize_input($_POST['name'] ?? '');
        $phone = sanitize_input($_POST['phone'] ?? '');
        $address = sanitize_input($_POST['address'] ?? '');
        $current_password = $_POST['current_password'] ?? '';
        $new_password = $_POST['new_password'] ?? '';
        $confirm_password = $_POST['confirm_password'] ?? '';
        
        if (empty($name) || strlen($name) < 3) {
            $errors[] = "Nome deve ter pelo menos 3 caracteres.";
        }
        
        // Se quer alterar password
        if (!empty($new_password)) {
            if (!verify_password($current_password, $user['password'])) {
                $errors[] = "Password atual incorreta.";
            }
            
            if (strlen($new_password) < 8) {
                $errors[] = "Nova password deve ter pelo menos 8 caracteres.";
            }
            
            if ($new_password !== $confirm_password) {
                $errors[] = "As passwords não coincidem.";
            }
        }
        
        // Upload de imagem de perfil
        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] !== UPLOAD_ERR_NO_FILE) {
            $upload_result = upload_image($_FILES['profile_image'], UPLOAD_PATH . 'profiles/');
            if (!$upload_result['success']) {
                $errors[] = $upload_result['message'];
            }
        }
        
        if (empty($errors)) {
            try {
                if (!empty($new_password)) {
                    $hashed_password = hash_password($new_password);
                    $stmt = $pdo->prepare("UPDATE users SET name = ?, phone = ?, address = ?, password = ? WHERE id = ?");
                    $stmt->execute([$name, $phone, $address, $hashed_password, $_SESSION['user_id']]);
                } else {
                    $stmt = $pdo->prepare("UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?");
                    $stmt->execute([$name, $phone, $address, $_SESSION['user_id']]);
                }
                
                // Atualizar imagem de perfil se foi feito upload
                if (isset($upload_result) && $upload_result['success']) {
                    // Apagar imagem antiga se existir
                    if ($user['profile_image'] && file_exists(UPLOAD_PATH . 'profiles/' . $user['profile_image'])) {
                        unlink(UPLOAD_PATH . 'profiles/' . $user['profile_image']);
                    }
                    
                    $stmt = $pdo->prepare("UPDATE users SET profile_image = ? WHERE id = ?");
                    $stmt->execute([$upload_result['filename'], $_SESSION['user_id']]);
                }
                
                log_activity($_SESSION['user_id'], 'Perfil atualizado');
                
                $success = "Perfil atualizado com sucesso!";
                
                // Recarregar dados do utilizador
                $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
                $stmt->execute([$_SESSION['user_id']]);
                $user = $stmt->fetch();
            } catch (PDOException $e) {
                $errors[] = "Erro ao atualizar perfil. Por favor, tente novamente.";
                error_log("Erro na atualização de perfil: " . $e->getMessage());
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
    <title>Meu Perfil - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../public/css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <h1>Meu Perfil</h1>
        
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
        
        <form method="POST" action="" enctype="multipart/form-data" class="form">
            <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
            
            <div class="form-section">
                <h2>Foto de Perfil</h2>
                <?php if ($user['profile_image']): ?>
                    <img src="../public/uploads/profiles/<?php echo htmlspecialchars($user['profile_image']); ?>" 
                         alt="Perfil" class="profile-image-large">
                <?php endif; ?>
                <div class="form-group">
                    <label for="profile_image">Alterar Foto</label>
                    <input type="file" id="profile_image" name="profile_image" accept="image/*">
                    <small>Formatos aceites: JPG, PNG, WEBP (máx. 5MB)</small>
                </div>
            </div>
            
            <div class="form-section">
                <h2>Informações Pessoais</h2>
                <div class="form-group">
                    <label for="name">Nome Completo *</label>
                    <input type="text" id="name" name="name" required 
                           value="<?php echo htmlspecialchars($user['name']); ?>" 
                           minlength="3" maxlength="100">
                </div>
                
                <div class="form-group">
                    <label for="email">Email (não editável)</label>
                    <input type="email" id="email" value="<?php echo htmlspecialchars($user['email']); ?>" disabled>
                </div>
                
                <div class="form-group">
                    <label for="phone">Telefone</label>
                    <input type="tel" id="phone" name="phone" 
                           value="<?php echo htmlspecialchars($user['phone']); ?>" 
                           maxlength="20">
                </div>
                
                <div class="form-group">
                    <label for="address">Morada</label>
                    <textarea id="address" name="address" rows="3" maxlength="255"><?php echo htmlspecialchars($user['address']); ?></textarea>
                </div>
            </div>
            
            <div class="form-section">
                <h2>Alterar Password (opcional)</h2>
                <div class="form-group">
                    <label for="current_password">Password Atual</label>
                    <input type="password" id="current_password" name="current_password">
                </div>
                
                <div class="form-group">
                    <label for="new_password">Nova Password</label>
                    <input type="password" id="new_password" name="new_password" minlength="8">
                    <small>Mínimo 8 caracteres</small>
                </div>
                
                <div class="form-group">
                    <label for="confirm_password">Confirmar Nova Password</label>
                    <input type="password" id="confirm_password" name="confirm_password" minlength="8">
                </div>
            </div>
            
            <button type="submit" class="btn btn-primary">Guardar Alterações</button>
            <a href="dashboard.php" class="btn btn-secondary">Cancelar</a>
        </form>
    </main>
    
    <?php include '../includes/footer.php'; ?>
</body>
</html>
