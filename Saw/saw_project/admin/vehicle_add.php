<?php
require_once '../config/config.php';
require_once '../includes/security.php';

require_login();
require_admin();

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $errors[] = "Token de segurança inválido.";
    } else {
        // Sanitizar inputs
        $brand = sanitize_input($_POST['brand']);
        $model = sanitize_input($_POST['model']);
        $year = filter_input(INPUT_POST, 'year', FILTER_VALIDATE_INT);
        $price = filter_input(INPUT_POST, 'price', FILTER_VALIDATE_FLOAT);
        $status = $_POST['status'];
        
        // Campos opcionais/adicionais
        $color = sanitize_input($_POST['color']);
        $fuel_type = $_POST['fuel_type'];
        $kilometers = filter_input(INPUT_POST, 'kilometers', FILTER_VALIDATE_INT) ?? 0;
        $doors = filter_input(INPUT_POST, 'doors', FILTER_VALIDATE_INT);
        $seats = filter_input(INPUT_POST, 'seats', FILTER_VALIDATE_INT);
        $description = sanitize_input($_POST['description']);

        if (!$brand || !$model || !$year || !$price) {
            $errors[] = "Preencha os campos obrigatórios (Marca, Modelo, Ano, Preço).";
        }

        if (empty($errors)) {
            try {
                $pdo->beginTransaction();

                // 1. Inserir Veículo
                $stmt = $pdo->prepare("INSERT INTO vehicles (brand, model, year, color, fuel_type, kilometers, doors, seats, price, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$brand, $model, $year, $color, $fuel_type, $kilometers, $doors, $seats, $price, $description, $status]);
                $vehicle_id = $pdo->lastInsertId();

                // 2. Upload da Imagem (se existir)
                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    $upload = upload_image($_FILES['image'], '../public/uploads/vehicles/');
                    
                    if ($upload['success']) {
                        $stmt = $pdo->prepare("INSERT INTO vehicle_images (vehicle_id, image_path, is_primary) VALUES (?, ?, TRUE)");
                        $stmt->execute([$vehicle_id, $upload['filename']]);
                    } else {
                        // Se falhar a imagem, avisamos mas o carro fica criado
                        $errors[] = "Veículo criado, mas erro na imagem: " . $upload['message'];
                    }
                }

                $pdo->commit();
                
                if (empty($errors)) {
                    log_activity($_SESSION['user_id'], 'Adicionou veículo', "ID: $vehicle_id");
                    redirect('vehicles.php?msg=Veículo adicionado com sucesso!');
                }

            } catch (Exception $e) {
                $pdo->rollBack();
                $errors[] = "Erro ao guardar na base de dados: " . $e->getMessage();
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
    <title>Adicionar Veículo - Admin</title>
    <link rel="stylesheet" href="../public/css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <h1>Adicionar Novo Veículo</h1>
        
        <?php if (!empty($errors)): ?>
            <div class="alert alert-error">
                <ul><?php foreach($errors as $e): ?><li><?=$e?></li><?php endforeach; ?></ul>
            </div>
        <?php endif; ?>

        <form method="POST" enctype="multipart/form-data" class="form">
            <input type="hidden" name="csrf_token" value="<?=$csrf_token?>">

            <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <div class="form-group">
                        <label>Marca *</label>
                        <input type="text" name="brand" required value="<?=htmlspecialchars($_POST['brand'] ?? '')?>">
                    </div>
                    <div class="form-group">
                        <label>Modelo *</label>
                        <input type="text" name="model" required value="<?=htmlspecialchars($_POST['model'] ?? '')?>">
                    </div>
                    <div class="form-group">
                        <label>Ano *</label>
                        <input type="number" name="year" required min="1900" max="<?=date('Y')+1?>" value="<?=htmlspecialchars($_POST['year'] ?? '')?>">
                    </div>
                    <div class="form-group">
                        <label>Preço (€) *</label>
                        <input type="number" step="0.01" name="price" required value="<?=htmlspecialchars($_POST['price'] ?? '')?>">
                    </div>
                    <div class="form-group">
                        <label>Estado *</label>
                        <select name="status" required>
                            <option value="disponível">Disponível</option>
                            <option value="indisponível">Indisponível</option>
                            <option value="brevemente">Brevemente</option>
                        </select>
                    </div>
                </div>

                <div>
                    <div class="form-group">
                        <label>Combustível</label>
                        <select name="fuel_type">
                            <option value="Gasolina">Gasolina</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Elétrico">Elétrico</option>
                            <option value="Híbrido">Híbrido</option>
                            <option value="GPL">GPL</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Quilómetros</label>
                        <input type="number" name="kilometers" value="<?=htmlspecialchars($_POST['kilometers'] ?? '0')?>">
                    </div>
                    <div class="form-group">
                        <label>Cor</label>
                        <input type="text" name="color" value="<?=htmlspecialchars($_POST['color'] ?? '')?>">
                    </div>
                    <div class="form-group">
                        <label>Foto Principal</label>
                        <input type="file" name="image" accept="image/*">
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Descrição</label>
                <textarea name="description" rows="3"><?=htmlspecialchars($_POST['description'] ?? '')?></textarea>
            </div>
            
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Adicionar Veículo</button>
                <a href="vehicles.php" class="btn btn-secondary">Cancelar</a>
            </div>
        </form>
    </main>
    <?php include '../includes/footer.php'; ?>
</body>
</html>