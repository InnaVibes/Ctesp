<?php
require_once '../config/config.php';
require_once '../includes/security.php';
require_login();

$vehicle_id = intval($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT v.*, GROUP_CONCAT(vi.image_path) as images FROM vehicles v 
                       LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id 
                       WHERE v.id = ? GROUP BY v.id");
$stmt->execute([$vehicle_id]);
$vehicle = $stmt->fetch();

if (!$vehicle) {
    redirect(SITE_URL . '/user/vehicles.php');
}

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['book_test_drive'])) {
    if (!verify_csrf_token($_POST['csrf_token'] ?? '')) {
        $errors[] = "Token de segurança inválido.";
    } else {
        $test_date = $_POST['test_date'] ?? '';
        $test_time = $_POST['test_time'] ?? '';
        $notes = sanitize_input($_POST['notes'] ?? '');
        
        if (empty($test_date) || empty($test_time)) {
            $errors[] = "Data e hora são obrigatórias.";
        }
        
        $check_stmt = $pdo->prepare("SELECT id FROM test_drives WHERE test_date = ? AND test_time = ?");
        $check_stmt->execute([$test_date, $test_time]);
        if ($check_stmt->fetch()) {
            $errors[] = "Já existe uma reserva para esta data e hora.";
        }
        
        if (empty($errors)) {
            $stmt = $pdo->prepare("INSERT INTO test_drives (user_id, vehicle_id, test_date, test_time, notes) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$_SESSION['user_id'], $vehicle_id, $test_date, $test_time, $notes]);
            log_activity($_SESSION['user_id'], 'Reserva de test drive', "Veículo ID: $vehicle_id");
            $success = "Test drive agendado com sucesso!";
        }
    }
}

$csrf_token = generate_csrf_token();
$images = $vehicle['images'] ? explode(',', $vehicle['images']) : [];
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?> - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../public/css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <main class="container">
        <h1><?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?></h1>
        
        <?php if (!empty($errors)): ?>
            <div class="alert alert-error"><ul><?php foreach ($errors as $error): ?><li><?php echo htmlspecialchars($error); ?></li><?php endforeach; ?></ul></div>
        <?php endif; ?>
        <?php if ($success): ?>
            <div class="alert alert-success"><?php echo htmlspecialchars($success); ?></div>
        <?php endif; ?>
        
        <div class="vehicle-detail">
            <div class="vehicle-images">
                <?php if (count($images) > 0): ?>
                    <?php foreach ($images as $image): ?>
                        <img src="../public/uploads/vehicles/<?php echo htmlspecialchars($image); ?>" alt="Veículo">
                    <?php endforeach; ?>
                <?php else: ?>
                    <img src="../public/images/no-image.jpg" alt="Sem imagem">
                <?php endif; ?>
            </div>
            
            <div class="vehicle-specs">
                <h2>Especificações</h2>
                <table>
                    <tr><td><strong>Marca:</strong></td><td><?php echo htmlspecialchars($vehicle['brand']); ?></td></tr>
                    <tr><td><strong>Modelo:</strong></td><td><?php echo htmlspecialchars($vehicle['model']); ?></td></tr>
                    <tr><td><strong>Ano:</strong></td><td><?php echo htmlspecialchars($vehicle['year']); ?></td></tr>
                    <tr><td><strong>Cor:</strong></td><td><?php echo htmlspecialchars($vehicle['color']); ?></td></tr>
                    <tr><td><strong>Combustível:</strong></td><td><?php echo htmlspecialchars($vehicle['fuel_type']); ?></td></tr>
                    <tr><td><strong>Quilómetros:</strong></td><td><?php echo number_format($vehicle['kilometers']); ?> km</td></tr>
                    <tr><td><strong>Portas:</strong></td><td><?php echo $vehicle['doors']; ?></td></tr>
                    <tr><td><strong>Lugares:</strong></td><td><?php echo $vehicle['seats']; ?></td></tr>
                    <tr><td><strong>Preço:</strong></td><td class="price">€ <?php echo number_format($vehicle['price'], 2, ',', '.'); ?></td></tr>
                    <tr><td><strong>Estado:</strong></td><td><span class="badge badge-<?php echo $vehicle['status']; ?>"><?php echo ucfirst($vehicle['status']); ?></span></td></tr>
                </table>
                
                <?php if ($vehicle['description']): ?>
                    <h3>Descrição</h3>
                    <p><?php echo nl2br(htmlspecialchars($vehicle['description'])); ?></p>
                <?php endif; ?>
            </div>
            
            <?php if ($vehicle['status'] === 'disponível'): ?>
                <div class="booking-form">
                    <h2>Agendar Test Drive</h2>
                    <form method="POST" action="" class="form">
                        <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
                        <input type="hidden" name="book_test_drive" value="1">
                        <div class="form-group">
                            <label for="test_date">Data *</label>
                            <input type="date" id="test_date" name="test_date" required min="<?php echo date('Y-m-d'); ?>">
                        </div>
                        <div class="form-group">
                            <label for="test_time">Hora *</label>
                            <select id="test_time" name="test_time" required>
                                <option value="">Selecione</option>
                                <option value="09:00:00">09:00</option>
                                <option value="10:00:00">10:00</option>
                                <option value="11:00:00">11:00</option>
                                <option value="14:00:00">14:00</option>
                                <option value="15:00:00">15:00</option>
                                <option value="16:00:00">16:00</option>
                                <option value="17:00:00">17:00</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="notes">Notas (opcional)</label>
                            <textarea id="notes" name="notes" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Agendar</button>
                    </form>
                </div>
            <?php endif; ?>
        </div>
        <a href="vehicles.php" class="btn btn-secondary">Voltar</a>
    </main>
    <?php include '../includes/footer.php'; ?>
</body>
</html>
