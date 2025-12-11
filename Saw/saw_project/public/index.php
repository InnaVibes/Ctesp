<?php
require_once '../config/config.php';
require_once '../includes/security.php';

// Buscar todos os veículos (sem informação de estado para não registados)
$stmt = $pdo->query("SELECT v.*, (SELECT image_path FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = TRUE LIMIT 1) as image 
                     FROM vehicles v 
                     ORDER BY v.created_at DESC");
$vehicles = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_NAME; ?> - Início</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <section class="hero">
            <h1>Bem-vindo ao <?php echo SITE_NAME; ?></h1>
            <p>Encontre o seu próximo veículo de sonho</p>
        </section>

        <section class="vehicles-grid">
            <h2>Os Nossos Veículos</h2>
            <div class="grid">
                <?php foreach ($vehicles as $vehicle): ?>
                    <div class="vehicle-card">
                        <div class="vehicle-image">
                            <?php if ($vehicle['image']): ?>
                                <img src="uploads/vehicles/<?php echo htmlspecialchars($vehicle['image']); ?>" 
                                     alt="<?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?>">
                            <?php else: ?>
                                <img src="images/no-image.jpg" alt="Sem imagem">
                            <?php endif; ?>
                        </div>
                        <div class="vehicle-info">
                            <h3><?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?></h3>
                            <p class="year">Ano: <?php echo htmlspecialchars($vehicle['year']); ?></p>
                            <p class="price">€ <?php echo number_format($vehicle['price'], 2, ',', '.'); ?></p>
                            <p class="specs">
                                <?php echo htmlspecialchars($vehicle['fuel_type']); ?> | 
                                <?php echo number_format($vehicle['kilometers']); ?> km
                            </p>
                            <?php if (is_logged_in()): ?>
                                <a href="../user/vehicle_detail.php?id=<?php echo $vehicle['id']; ?>" class="btn btn-primary">Ver Detalhes</a>
                            <?php else: ?>
                                <a href="login.php" class="btn btn-secondary">Login para Ver Mais</a>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>

        <?php if (!is_logged_in()): ?>
        <section class="cta">
            <h2>Interessado?</h2>
            <p>Registe-se para aceder a todas as funcionalidades e marcar test drives</p>
            <a href="register.php" class="btn btn-large">Registar Agora</a>
        </section>
        <?php endif; ?>
    </main>

    <?php include '../includes/footer.php'; ?>
</body>
</html>
