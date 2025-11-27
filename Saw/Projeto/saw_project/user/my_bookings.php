<?php
require_once '../config/config.php';
require_once '../includes/security.php';
require_login();

$stmt = $pdo->prepare("SELECT td.*, v.brand, v.model, v.year, v.price, 
                       (SELECT image_path FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = TRUE LIMIT 1) as image
                       FROM test_drives td 
                       JOIN vehicles v ON td.vehicle_id = v.id 
                       WHERE td.user_id = ? 
                       ORDER BY td.test_date DESC, td.test_time DESC");
$stmt->execute([$_SESSION['user_id']]);
$bookings = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minhas Reservas - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../public/css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <main class="container">
        <h1>Minhas Reservas de Test Drive</h1>
        <?php if (count($bookings) > 0): ?>
            <div class="bookings-list">
                <?php foreach ($bookings as $booking): ?>
                    <div class="booking-card">
                        <?php if ($booking['image']): ?>
                            <img src="../public/uploads/vehicles/<?php echo htmlspecialchars($booking['image']); ?>" alt="Veículo">
                        <?php endif; ?>
                        <div class="booking-info">
                            <h3><?php echo htmlspecialchars($booking['brand'] . ' ' . $booking['model']); ?> (<?php echo $booking['year']; ?>)</h3>
                            <p><strong>Data:</strong> <?php echo date('d/m/Y', strtotime($booking['test_date'])); ?></p>
                            <p><strong>Hora:</strong> <?php echo date('H:i', strtotime($booking['test_time'])); ?></p>
                            <p><strong>Estado:</strong> <span class="badge badge-<?php echo $booking['status']; ?>"><?php echo ucfirst($booking['status']); ?></span></p>
                            <?php if ($booking['notes']): ?>
                                <p><strong>Notas:</strong> <?php echo htmlspecialchars($booking['notes']); ?></p>
                            <?php endif; ?>
                            <a href="vehicle_detail.php?id=<?php echo $booking['vehicle_id']; ?>" class="btn btn-small">Ver Veículo</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <p>Ainda não tem reservas.</p>
            <a href="vehicles.php" class="btn btn-primary">Ver Veículos</a>
        <?php endif; ?>
    </main>
    <?php include '../includes/footer.php'; ?>
</body>
</html>
