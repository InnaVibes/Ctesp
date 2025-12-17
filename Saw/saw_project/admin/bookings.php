<?php 
require_once '../config/config.php'; 
require_once '../includes/security.php'; 
require_login(); 
require_admin();

// 1. Preparar os filtros
$filter_date = $_GET['date'] ?? '';
$filter_vehicle = $_GET['vehicle_id'] ?? '';

// 2. Construir a Query com base nos filtros
$sql = "SELECT td.*, u.name as user_name, u.email, v.brand, v.model 
        FROM test_drives td 
        JOIN users u ON td.user_id = u.id 
        JOIN vehicles v ON td.vehicle_id = v.id 
        WHERE 1=1";

$params = [];

if ($filter_date) {
    $sql .= " AND td.test_date = ?";
    $params[] = $filter_date;
}

if ($filter_vehicle) {
    $sql .= " AND td.vehicle_id = ?";
    $params[] = $filter_vehicle;
}

$sql .= " ORDER BY td.test_date DESC, td.test_time DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$bookings = $stmt->fetchAll();

// 3. Buscar lista de veículos para o "select" do filtro
$vehicles_list = $pdo->query("SELECT id, brand, model FROM vehicles ORDER BY brand, model")->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Reservas - Admin</title>
    <link rel="stylesheet" href="../public/css/style.css">
    <style>
        .filters {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
        }
        .filter-form {
            display: flex;
            gap: 15px;
            align-items: flex-end;
        }
    </style>
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <h1>Gerir Reservas</h1>

        <div class="filters">
            <form method="GET" class="filter-form">
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="date">Filtrar por Data:</label>
                    <input type="date" name="date" id="date" value="<?=$filter_date?>">
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                    <label for="vehicle_id">Filtrar por Veículo:</label>
                    <select name="vehicle_id" id="vehicle_id">
                        <option value="">Todos os Veículos</option>
                        <?php foreach($vehicles_list as $v): ?>
                            <option value="<?=$v['id']?>" <?= ($filter_vehicle == $v['id']) ? 'selected' : '' ?>>
                                <?=htmlspecialchars($v['brand'] . ' ' . $v['model'])?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <button type="submit" class="btn btn-primary">Filtrar</button>
                <?php if($filter_date || $filter_vehicle): ?>
                    <a href="bookings.php" class="btn btn-secondary">Limpar</a>
                <?php endif; ?>
            </form>
        </div>

        <?php if (count($bookings) > 0): ?>
            <table>
                <tr>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Veículo</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Email</th>
                </tr>
                <?php foreach($bookings as $b): ?>
                <tr>
                    <td><?=date('d/m/Y',strtotime($b['test_date']))?></td>
                    <td><?=date('H:i',strtotime($b['test_time']))?></td>
                    <td><?=htmlspecialchars($b['brand'].' '.$b['model'])?></td>
                    <td><?=htmlspecialchars($b['user_name'])?></td>
                    <td><span class="badge-<?=$b['status']?>"><?=ucfirst($b['status'])?></span></td>
                    <td><?=htmlspecialchars($b['email'])?></td>
                </tr>
                <?php endforeach; ?>
            </table>
        <?php else: ?>
            <p>Não foram encontradas reservas com estes critérios.</p>
        <?php endif; ?>

    </main>
    <?php include '../includes/footer.php'; ?>
</body>
</html>