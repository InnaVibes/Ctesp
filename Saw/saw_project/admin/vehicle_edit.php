<?php
require_once '../config/config.php';
require_once '../includes/security.php';

require_login();
require_admin();

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) redirect('vehicles.php');

// Buscar dados atuais
$stmt = $pdo->prepare("SELECT * FROM vehicles WHERE id = ?");
$stmt->execute([$id]);
$vehicle = $stmt->fetch();

if (!$vehicle) redirect('vehicles.php?err=Veículo não encontrado');

// Buscar imagem atual
$stmt_img = $pdo->prepare("SELECT image_path FROM vehicle_images WHERE vehicle_id = ? AND is_primary = TRUE LIMIT 1");
$stmt_img->execute([$id]);
$current_image = $stmt_img->fetchColumn();

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $errors[] = "Token de segurança inválido.";
    } else {
        // Sanitizar e Validar
        $brand = sanitize_input($_POST['brand']);
        $model = sanitize_input($_POST['model']);
        $year = filter_input(INPUT_POST, 'year', FILTER_VALIDATE_INT);
        $price = filter_input(INPUT_POST, 'price', FILTER_VALIDATE_FLOAT);
        $status = $_POST['status'];
        
        // Outros campos
        $color = sanitize_input($_POST['color']);
        $fuel_type = $_POST['fuel_type'];
        $kilometers = filter_input(INPUT_POST, 'kilometers', FILTER_VALIDATE_INT);
        $description = sanitize_input($_POST['description']);

        if (!$brand || !$model || !$year) {
            $errors[] = "Campos obrigatórios em falta.";
        }

        if (empty($errors)) {
            try {
                $pdo->beginTransaction();

                // 1. Atualizar dados do veículo
                $sql = "UPDATE vehicles SET brand=?, model=?, year=?, price=?, status=?, color=?, fuel_type=?, kilometers=?, description=? WHERE id=?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$brand, $model, $year, $price, $status, $color, $fuel_type, $kilometers, $description, $id]);

                // 2. Se foi enviada nova imagem
                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    $upload = upload_image($_FILES['image'], '../public/uploads/vehicles/');
                    
                    if ($upload['success']) {
                        // Remove "is_primary" das imagens antigas
                        $pdo->prepare("UPDATE vehicle_images SET is_primary = FALSE WHERE vehicle_id = ?")->execute([$id]);
                        
                        // Insere a nova como primary
                        $stmt = $pdo->prepare("INSERT INTO vehicle_images (vehicle_id, image_path, is_primary) VALUES (?, ?, TRUE)");
                        $stmt->execute([$id, $upload['filename']]);
                    } else {
                        $errors[] = "Erro ao carregar imagem: " . $upload['message'];
                    }
                }

                $pdo->commit();
                
                if (empty($errors)) {
                    log_activity($_SESSION['user_id'], 'Editou veículo', "ID: $id");
                    redirect('vehicles.php?msg=Veículo atualizado com sucesso!');
                }

            } catch (Exception $e) {
                $pdo->rollBack();
                $errors[] = "Erro ao atualizar: " . $e->getMessage();
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
    <title>Editar Veículo - Admin</title>
    <link rel="stylesheet" href="../public/css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <h1>Editar Veículo</h1>
        
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
                        <label>Marca</label>
                        <input type="text" name="brand" required value="<?=htmlspecialchars($vehicle['brand'])?>">
                    </div>
                    <div class="form-group">
                        <label>Modelo</label>
                        <input type="text" name="model" required value="<?=htmlspecialchars($vehicle['model'])?>">
                    </div>
                    <div class="form-group">
                        <label>Ano</label>
                        <input type="number" name="year" required value="<?=htmlspecialchars($vehicle['year'])?>">
                    </div>
                    <div class="form-group">
                        <label>Preço (€)</label>
                        <input type="number" step="0.01" name="price" required value="<?=htmlspecialchars($vehicle['price'])?>">
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select name="status">
                            <?php 
                            $statuses = ['disponível', 'indisponível', 'brevemente'];
                            foreach($statuses as $s): 
                            ?>
                                <option value="<?=$s?>" <?=($vehicle['status'] == $s) ? 'selected' : ''?>>
                                    <?=ucfirst($s)?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div>
                    <div class="form-group">
                        <label>Combustível</label>
                        <select name="fuel_type">
                            <?php 
                            $fuels = ['Gasolina', 'Diesel', 'Elétrico', 'Híbrido', 'GPL'];
                            foreach($fuels as $f): 
                            ?>
                                <option value="<?=$f?>" <?=($vehicle['fuel_type'] == $f) ? 'selected' : ''?>><?=$f?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Quilómetros</label>
                        <input type="number" name="kilometers" value="<?=htmlspecialchars($vehicle['kilometers'])?>">
                    </div>
                    <div class="form-group">
                        <label>Cor</label>
                        <input type="text" name="color" value="<?=htmlspecialchars($vehicle['color'])?>">
                    </div>
                    
                    <div class="form-group">
                        <label>Imagem Atual</label><br>
                        <?php if($current_image): ?>
                            <img src="../public/uploads/vehicles/<?=$current_image?>" style="max-height: 100px; margin-bottom: 10px;">
                        <?php else: ?>
                            <p>Sem imagem.</p>
                        <?php endif; ?>
                        
                        <label>Alterar Imagem (opcional)</label>
                        <input type="file" name="image" accept="image/*">
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Descrição</label>
                <textarea name="description" rows="3"><?=htmlspecialchars($vehicle['description'])?></textarea>
            </div>
            
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Guardar Alterações</button>
                <a href="vehicles.php" class="btn btn-secondary">Cancelar</a>
            </div>
        </form>
    </main>
    <?php include '../includes/footer.php'; ?>
</body>
</html>