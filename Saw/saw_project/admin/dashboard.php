<?php require_once '../config/config.php'; require_once '../includes/security.php'; require_login(); require_admin();
$stats = ['users' => $pdo->query("SELECT COUNT(*) FROM users WHERE user_type='user'")->fetchColumn(),
          'vehicles' => $pdo->query("SELECT COUNT(*) FROM vehicles")->fetchColumn(),
          'pending' => $pdo->query("SELECT COUNT(*) FROM test_drives WHERE status='pendente'")->fetchColumn()];
?>
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Admin</title><link rel="stylesheet" href="../public/css/style.css"></head>
<body><?php include '../includes/header.php'; ?><main class="container"><h1>Admin Dashboard</h1>
<div class="stats"><p>Utilizadores: <?=$stats['users']?></p><p>Veículos: <?=$stats['vehicles']?></p><p>Pendentes: <?=$stats['pending']?></p></div>
<p><a href="users.php" class="btn">Gerir Utilizadores</a> <a href="vehicles.php" class="btn">Gerir Veículos</a> <a href="bookings.php" class="btn">Gerir Reservas</a></p>
</main><?php include '../includes/footer.php'; ?></body></html>
