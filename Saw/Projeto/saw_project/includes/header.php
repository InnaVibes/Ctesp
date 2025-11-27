<header><nav class="navbar"><div class="container"><a href="<?=SITE_URL?>/public/index.php" class="logo"><?=SITE_NAME?></a><ul class="nav-menu">
<li><a href="<?=SITE_URL?>/public/index.php">Início</a></li><?php if(is_logged_in()): ?>
<?php if(is_admin()): ?><li><a href="<?=SITE_URL?>/admin/dashboard.php">Admin</a></li>
<?php else: ?><li><a href="<?=SITE_URL?>/user/dashboard.php">Dashboard</a></li>
<li><a href="<?=SITE_URL?>/user/vehicles.php">Veículos</a></li><li><a href="<?=SITE_URL?>/user/my_bookings.php">Minhas Reservas</a></li>
<li><a href="<?=SITE_URL?>/user/profile.php">Perfil</a></li><?php endif; ?>
<li><a href="<?=SITE_URL?>/public/logout.php">Sair</a></li><?php else: ?>
<li><a href="<?=SITE_URL?>/public/login.php">Login</a></li><li><a href="<?=SITE_URL?>/public/register.php">Registar</a></li>
<?php endif; ?></ul></div></nav></header>
