<?php require_once '../config/config.php'; require_once '../includes/security.php'; require_login(); require_admin();
$bookings = $pdo->query("SELECT td.*, u.name as user_name, u.email, v.brand, v.model FROM test_drives td 
JOIN users u ON td.user_id=u.id JOIN vehicles v ON td.vehicle_id=v.id ORDER BY td.test_date DESC, td.test_time DESC")->fetchAll();
?>
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reservas</title><link rel="stylesheet" href="../public/css/style.css"></head>
<body><?php include '../includes/header.php'; ?><main class="container"><h1>Gerir Reservas</h1>
<table><tr><th>Utilizador</th><th>Veículo</th><th>Data</th><th>Hora</th><th>Estado</th><th>Email</th></tr>
<?php foreach($bookings as $b): ?><tr><td><?=htmlspecialchars($b['user_name'])?></td><td><?=htmlspecialchars($b['brand'].' '.$b['model'])?></td>
<td><?=date('d/m/Y',strtotime($b['test_date']))?></td><td><?=date('H:i',strtotime($b['test_time']))?></td>
<td><span class="badge-<?=$b['status']?>"><?=ucfirst($b['status'])?></span></td><td><?=htmlspecialchars($b['email'])?></td></tr>
<?php endforeach; ?></table></main><?php include '../includes/footer.php'; ?></body></html>
