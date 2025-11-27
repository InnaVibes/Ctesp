<?php require_once '../config/config.php'; require_once '../includes/security.php'; require_login(); require_admin();
$users = $pdo->query("SELECT * FROM users WHERE user_type='user' ORDER BY created_at DESC")->fetchAll();
?>
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Utilizadores</title><link rel="stylesheet" href="../public/css/style.css"></head>
<body><?php include '../includes/header.php'; ?><main class="container"><h1>Gerir Utilizadores</h1>
<table><tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Data Registo</th><th>Estado</th></tr>
<?php foreach($users as $u): ?><tr><td><?=htmlspecialchars($u['name'])?></td><td><?=htmlspecialchars($u['email'])?></td>
<td><?=htmlspecialchars($u['phone'])?></td><td><?=date('d/m/Y', strtotime($u['created_at']))?></td>
<td><?=$u['is_active']?'Ativo':'Inativo'?></td></tr><?php endforeach; ?></table>
<a href="dashboard.php" class="btn">Voltar</a></main><?php include '../includes/footer.php'; ?></body></html>
