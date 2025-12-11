<?php require_once '../config/config.php'; require_once '../includes/security.php'; require_login(); require_admin();
$vehicles = $pdo->query("SELECT * FROM vehicles ORDER BY created_at DESC")->fetchAll();
?>
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Veículos</title><link rel="stylesheet" href="../public/css/style.css"></head>
<body><?php include '../includes/header.php'; ?><main class="container"><h1>Gerir Veículos</h1>
<a href="vehicle_add.php" class="btn btn-primary">Adicionar Veículo</a>
<table><tr><th>Marca/Modelo</th><th>Ano</th><th>Preço</th><th>Estado</th><th>Ações</th></tr>
<?php foreach($vehicles as $v): ?><tr><td><?=htmlspecialchars($v['brand'].' '.$v['model'])?></td><td><?=$v['year']?></td>
<td>€<?=number_format($v['price'],2,',','.')?></td><td><span class="badge-<?=$v['status']?>"><?=ucfirst($v['status'])?></span></td>
<td><a href="vehicle_edit.php?id=<?=$v['id']?>" class="btn-small">Editar</a></td></tr><?php endforeach; ?></table>
</main><?php include '../includes/footer.php'; ?></body></html>
