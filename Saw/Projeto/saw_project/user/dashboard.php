<?php
require_once '../config/config.php';
require_once '../includes/security.php';

require_login();

// Buscar informações do utilizador
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

// Buscar reservas do utilizador
$stmt = $pdo->prepare("SELECT td.*, v.brand, v.model, v.year 
                       FROM test_drives td 
                       JOIN vehicles v ON td.vehicle_id = v.id 
                       WHERE td.user_id = ? 
                       ORDER BY td.test_date DESC, td.test_time DESC");
$stmt->execute([$_SESSION['user_id']]);
$reservations = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../public/css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container dashboard">
        <h1>Bem-vindo, <?php echo htmlspecialchars($user['name']); ?>!</h1>
        
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h2>Meu Perfil</h2>
                <div class="profile-info">
                    <?php if ($user['profile_image']): ?>
                        <img src="../public/uploads/profiles/<?php echo htmlspecialchars($user['profile_image']); ?>" 
                             alt="Perfil" class="profile-image">
                    <?php endif; ?>
                    <p><strong>Nome:</strong> <?php echo htmlspecialchars($user['name']); ?></p>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
                    <?php if ($user['phone']): ?>
                        <p><strong>Telefone:</strong> <?php echo htmlspecialchars($user['phone']); ?></p>
                    <?php endif; ?>
                </div>
                <a href="profile.php" class="btn btn-primary">Editar Perfil</a>
            </div>
            
            <div class="dashboard-card">
                <h2>Minhas Reservas</h2>
                <?php if (count($reservations) > 0): ?>
                    <div class="reservations-list">
                        <?php foreach (array_slice($reservations, 0, 5) as $reservation): ?>
                            <div class="reservation-item">
                                <p><strong><?php echo htmlspecialchars($reservation['brand'] . ' ' . $reservation['model']); ?></strong></p>
                                <p>Data: <?php echo date('d/m/Y', strtotime($reservation['test_date'])); ?> 
                                   às <?php echo date('H:i', strtotime($reservation['test_time'])); ?></p>
                                <span class="badge badge-<?php echo $reservation['status']; ?>">
                                    <?php echo ucfirst($reservation['status']); ?>
                                </span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <a href="my_bookings.php" class="btn btn-secondary">Ver Todas</a>
                <?php else: ?>
                    <p>Ainda não tem reservas.</p>
                    <a href="vehicles.php" class="btn btn-primary">Ver Veículos</a>
                <?php endif; ?>
            </div>
            
            <div class="dashboard-card">
                <h2>Ações Rápidas</h2>
                <ul class="quick-actions">
                    <li><a href="vehicles.php">Consultar Veículos</a></li>
                    <li><a href="my_bookings.php">Minhas Reservas</a></li>
                    <li><a href="profile.php">Editar Perfil</a></li>
                </ul>
            </div>
        </div>
    </main>
    
    <?php include '../includes/footer.php'; ?>
</body>
</html>
