<?php
require_once '../config/config.php';
require_once '../includes/security.php';

require_login();

// Filtros
$brand = $_GET['brand'] ?? '';
$year = $_GET['year'] ?? '';

$sql = "SELECT v.*, (SELECT image_path FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = TRUE LIMIT 1) as image 
        FROM vehicles v WHERE 1=1";
$params = [];

if ($brand) {
    $sql .= " AND v.brand = ?";
    $params[] = $brand;
}

if ($year) {
    $sql .= " AND v.year = ?";
    $params[] = $year;
}

$sql .= " ORDER BY v.created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$vehicles = $stmt->fetchAll();

// Buscar marcas para filtro
$brands = $pdo->query("SELECT DISTINCT brand FROM vehicles ORDER BY brand")->fetchAll(PDO::FETCH_COLUMN);
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Veículos - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../public/css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <h1>Consultar Veículos</h1>
        
        <div class="filters">
            <form method="GET" action="" class="filter-form">
                <div class="form-group">
                    <label for="brand">Marca</label>
                    <select id="brand" name="brand">
                        <option value="">Todas</option>
                        <?php foreach ($brands as $b): ?>
                            <option value="<?php echo htmlspecialchars($b); ?>" 
                                    <?php echo $brand === $b ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($b); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="year">Ano</label>
                    <input type="number" id="year" name="year" min="1990" max="<?php echo date('Y'); ?>" 
                           value="<?php echo htmlspecialchars($year); ?>" placeholder="Ex: 2020">
                </div>
                
                <button type="submit" class="btn btn-primary">Filtrar</button>
                <a href="vehicles.php" class="btn btn-secondary">Limpar</a>
            </form>
        </div>
        
        <div class="vehicles-grid">
            <?php if (count($vehicles) > 0): ?>
                <?php foreach ($vehicles as $vehicle): ?>
                    <div class="vehicle-card">
                        <div class="vehicle-image">
                            <?php if ($vehicle['image']): ?>
                                <img src="../public/uploads/vehicles/<?php echo htmlspecialchars($vehicle['image']); ?>" 
                                     alt="<?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?>">
                            <?php else: ?>
                                <img src="../public/images/no-image.jpg" alt="Sem imagem">
                            <?php endif; ?>
                            <span class="badge badge-<?php echo $vehicle['status']; ?>">
                                <?php echo ucfirst($vehicle['status']); ?>
                            </span>
                        </div>
                        <div class="vehicle-info">
                            <h3><?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?></h3>
                            <p class="year">Ano: <?php echo htmlspecialchars($vehicle['year']); ?></p>
                            <p class="price">€ <?php echo number_format($vehicle['price'], 2, ',', '.'); ?></p>
                            <p class="specs">
                                <?php echo htmlspecialchars($vehicle['fuel_type']); ?> | 
                                <?php echo number_format($vehicle['kilometers']); ?> km | 
                                <?php echo $vehicle['doors']; ?> portas
                            </p>
                            <a href="vehicle_detail.php?id=<?php echo $vehicle['id']; ?>" class="btn btn-primary">Ver Detalhes</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p class="no-results">Nenhum veículo encontrado com os filtros selecionados.</p>
            <?php endif; ?>
        </div>
    </main>
    
    <?php include '../includes/footer.php'; ?>
</body>
</html>
