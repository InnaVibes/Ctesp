<?php
require_once '../config/config.php';
require_once '../includes/security.php';
require_login();
require_admin();

$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$admin = $stmt->fetch();

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $name = sanitize_input($_POST['name'] ?? '');
        $phone = sanitize_input($_POST['phone'] ?? '');
        $address = sanitize_input($_POST['address'] ?? '');
        
        if (!empty($_POST['new_password'])) {
            if (!verify_password($_POST['current_password'], $admin['password'])) {
                $errors[] = "Password atual incorreta.";
            } else if ($_POST['new_password'] !== $_POST['confirm_password']) {
                $errors[] = "As passwords não coincidem.";
            } else {
                $hashed = hash_password($_POST['new_password']);
                $pdo->prepare("UPDATE users SET name=?, phone=?, address=?, password=? WHERE id=?")->execute([$name, $phone, $address, $hashed, $_SESSION['user_id']]);
                $success = "Perfil atualizado!";
            }
        } else {
            $pdo->prepare("UPDATE users SET name=?, phone=?, address=? WHERE id=?")->execute([$name, $phone, $address, $_SESSION['user_id']]);
            $success = "Perfil atualizado!";
        }
    }
}
$csrf = generate_csrf_token();
?>
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Perfil Admin</title><link rel="stylesheet" href="../public/css/style.css"></head>
<body><?php include '../includes/header.php'; ?><main class="container"><h1>Perfil do Administrador</h1>
<?php if($success): ?><div class="alert alert-success"><?=$success?></div><?php endif; ?>
<?php if($errors): ?><div class="alert alert-error"><ul><?php foreach($errors as $e): ?><li><?=$e?></li><?php endforeach; ?></ul></div><?php endif; ?>
<form method="POST" class="form">
<input type="hidden" name="csrf_token" value="<?=$csrf?>">
<div class="form-group"><label>Nome</label><input type="text" name="name" value="<?=htmlspecialchars($admin['name'])?>" required></div>
<div class="form-group"><label>Email (não editável)</label><input type="email" value="<?=htmlspecialchars($admin['email'])?>" disabled></div>
<div class="form-group"><label>Telefone</label><input type="tel" name="phone" value="<?=htmlspecialchars($admin['phone'])?>"></div>
<div class="form-group"><label>Morada</label><textarea name="address"><?=htmlspecialchars($admin['address'])?></textarea></div>
<h2>Alterar Password (opcional)</h2>
<div class="form-group"><label>Password Atual</label><input type="password" name="current_password"></div>
<div class="form-group"><label>Nova Password</label><input type="password" name="new_password" minlength="8"></div>
<div class="form-group"><label>Confirmar Password</label><input type="password" name="confirm_password"></div>
<button type="submit" class="btn btn-primary">Guardar</button>
<a href="dashboard.php" class="btn btn-secondary">Voltar</a>
</form></main><?php include '../includes/footer.php'; ?></body></html>
