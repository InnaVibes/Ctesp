<?php
require_once '../config/config.php';
require_once '../includes/security.php';

// Apenas admin pode aceder
require_login();
require_admin();

// 1. Validar o ID
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

// 2. Validar o Token de Segurança (CSRF)
// Isto impede que hackers forjem links para apagar carros
$token = $_GET['csrf_token'] ?? '';

if (!$id || !verify_csrf_token($token)) {
    redirect('vehicles.php?err=Pedido inválido ou token de segurança incorreto.');
}

try {
    // 3. Verificar se o veículo existe
    $stmt = $pdo->prepare("SELECT id FROM vehicles WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($stmt->fetch()) {
        // 4. Eliminar o veículo
        // Nota: As imagens e test-drives são apagados automaticamente 
        // devido à configuração "ON DELETE CASCADE" na base de dados (ver database.sql)
        $stmt = $pdo->prepare("DELETE FROM vehicles WHERE id = ?");
        $stmt->execute([$id]);
        
        // Registar a atividade no log
        log_activity($_SESSION['user_id'], 'Eliminou veículo', "ID: $id");
        
        redirect('vehicles.php?msg=Veículo eliminado com sucesso.');
    } else {
        redirect('vehicles.php?err=Veículo não encontrado.');
    }
} catch (PDOException $e) {
    error_log("Erro ao eliminar veículo: " . $e->getMessage());
    redirect('vehicles.php?err=Erro ao eliminar veículo da base de dados.');
}
?>