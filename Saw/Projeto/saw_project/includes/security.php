<?php
// Funções de Segurança

// Sanitização de Input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Validação de Email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Hash de Password (usando bcrypt)
function hash_password($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

// Verificação de Password
function verify_password($password, $hash) {
    return password_verify($password, $hash);
}

// Geração de Token Seguro
function generate_token($length = 32) {
    return bin2hex(random_bytes($length));
}

// Proteção CSRF
function generate_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = generate_token();
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Validação de Upload de Imagem
function validate_image_upload($file) {
    $allowed_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'Erro no upload do ficheiro.'];
    }
    
    if ($file['size'] > MAX_FILE_SIZE) {
        return ['success' => false, 'message' => 'Ficheiro excede o tamanho máximo permitido (5MB).'];
    }
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mime_type, $allowed_types)) {
        return ['success' => false, 'message' => 'Tipo de ficheiro não permitido.'];
    }
    
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, $allowed_extensions)) {
        return ['success' => false, 'message' => 'Extensão de ficheiro não permitida.'];
    }
    
    return ['success' => true];
}

// Upload Seguro de Imagem
function upload_image($file, $directory) {
    $validation = validate_image_upload($file);
    if (!$validation['success']) {
        return $validation;
    }
    
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = uniqid('img_', true) . '.' . $extension;
    $filepath = $directory . $filename;
    
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }
    
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return ['success' => true, 'filename' => $filename];
    }
    
    return ['success' => false, 'message' => 'Erro ao mover o ficheiro.'];
}

// Verificação de Login
function is_logged_in() {
    return isset($_SESSION['user_id']) && isset($_SESSION['user_type']);
}

// Verificação de Admin
function is_admin() {
    return is_logged_in() && $_SESSION['user_type'] === 'admin';
}

// Verificação de User
function is_user() {
    return is_logged_in() && $_SESSION['user_type'] === 'user';
}

// Redirect com Segurança
function redirect($url) {
    header("Location: " . $url);
    exit();
}

// Proteção de Páginas
function require_login() {
    if (!is_logged_in()) {
        redirect(SITE_URL . '/public/login.php');
    }
}

function require_admin() {
    if (!is_admin()) {
        redirect(SITE_URL . '/public/index.php');
    }
}

// Logging de Atividades
function log_activity($user_id, $action, $details = '') {
    global $pdo;
    try {
        $stmt = $pdo->prepare("INSERT INTO activity_logs (user_id, action, details, ip_address, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$user_id, $action, $details, $_SERVER['REMOTE_ADDR']]);
    } catch (PDOException $e) {
        error_log("Erro ao registar atividade: " . $e->getMessage());
    }
}

// Rate Limiting Simples
function check_rate_limit($identifier, $max_attempts = 5, $time_window = 300) {
    if (!isset($_SESSION['rate_limit'][$identifier])) {
        $_SESSION['rate_limit'][$identifier] = ['count' => 1, 'start_time' => time()];
        return true;
    }
    
    $data = $_SESSION['rate_limit'][$identifier];
    
    if (time() - $data['start_time'] > $time_window) {
        $_SESSION['rate_limit'][$identifier] = ['count' => 1, 'start_time' => time()];
        return true;
    }
    
    if ($data['count'] >= $max_attempts) {
        return false;
    }
    
    $_SESSION['rate_limit'][$identifier]['count']++;
    return true;
}

// Escape para SQL (backup, PDO já protege)
function escape_sql($data) {
    global $pdo;
    return $pdo->quote($data);
}
?>
