<?php 
require_once '../config/config.php'; 
require_once '../includes/security.php'; 
require_login(); 
require_admin();

// Buscar veículos
$vehicles = $pdo->query("SELECT * FROM vehicles ORDER BY created_at DESC")->fetchAll();

// Gerar token de segurança (CSRF) para proteger o link de eliminar
$csrf_token = generate_csrf_token();
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Veículos - Admin</title>
    <link rel="stylesheet" href="../public/css/style.css">
    <style>
        /* Pequeno ajuste para separar os botões */
        .btn-danger { background-color: #dc3545; color: white; margin-left: 5px; }
        .btn-danger:hover { background-color: #c82333; }
    </style>
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="container">
        <h1>Gerir Veículos</h1>
        
        <?php if (isset($_GET['msg'])): ?>
            <div class="alert alert-success"><?php echo htmlspecialchars($_GET['msg']); ?></div>
        <?php endif; ?>
        <?php if (isset($_GET['err'])): ?>
            <div class="alert alert-error"><?php echo htmlspecialchars($_GET['err']); ?></div>
        <?php endif; ?>

        <a href="vehicle_add.php" class="btn btn-primary">Adicionar Veículo</a>
        
        <table>
            <tr>
                <th>Marca/Modelo</th>
                <th>Ano</th>
                <th>Preço</th>
                <th>Estado</th>
                <th>Ações</th>
            </tr>
            <?php foreach($vehicles as $v): ?>
            <tr>
                <td><?=htmlspecialchars($v['brand'].' '.$v['model'])?></td>
                <td><?=$v['year']?></td>
                <td>€<?=number_format($v['price'],2,',','.')?></td>
                <td><span class="badge-<?=$v['status']?>"><?=ucfirst($v['status'])?></span></td>
                <td>
                    <a href="vehicle_edit.php?id=<?=$v['id']?>" class="btn btn-small">Editar</a>
                    
                    <a href="vehicle_delete.php?id=<?=$v['id']?>&csrf_token=<?=$csrf_token?>" 
                       class="btn btn-small btn-danger"
                       onclick="return confirm('Tem a certeza que deseja eliminar o <?=htmlspecialchars($v['brand'])?>? Esta ação é irreversível.');">
                       Eliminar
                    </a>
                </td>
            </tr>
            <?php endforeach; ?>
        </table>
    </main>
    <?php include '../includes/footer.php'; ?>
</body>
</html>