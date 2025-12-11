-- Base de Dados para Stand Automóvel
-- Executar este script para criar as tabelas necessárias

CREATE DATABASE IF NOT EXISTS stand_automovel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE stand_automovel;

-- Tabela de Utilizadores
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    profile_image VARCHAR(255),
    user_type ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Tokens de Recuperação de Senha
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Remember Me
CREATE TABLE remember_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Veículos
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    color VARCHAR(30),
    fuel_type ENUM('Gasolina', 'Diesel', 'Elétrico', 'Híbrido', 'GPL') NOT NULL,
    kilometers INT DEFAULT 0,
    doors INT,
    seats INT,
    price DECIMAL(10,2),
    description TEXT,
    status ENUM('disponível', 'indisponível', 'brevemente') DEFAULT 'disponível',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_brand (brand),
    INDEX idx_year (year),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Fotos de Veículos
CREATE TABLE vehicle_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_vehicle_id (vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Reservas de Test Drive
CREATE TABLE test_drives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    test_date DATE NOT NULL,
    test_time TIME NOT NULL,
    status ENUM('pendente', 'confirmado', 'cancelado', 'concluído') DEFAULT 'pendente',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_datetime (test_date, test_time),
    INDEX idx_user_id (user_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_test_date (test_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Logs de Atividade
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir dados iniciais

-- Inserir Admin (password: admin123)
INSERT INTO users (name, email, password, user_type, phone, address) VALUES 
('Administrador', 'admin@standautomovel.pt', '$2y$12$LQv3c1yycjQoxe3FaJQ.Oe5YKzAqT0H5vJKhZ8f8KqHk5GxDfHaVS', 'admin', '912345678', 'Rua do Stand, 123, Porto');

-- Inserir Utilizadores de Teste (password: user123)
INSERT INTO users (name, email, password, user_type, phone, address) VALUES 
('João Silva', 'joao.silva@email.pt', '$2y$12$dQPyc8s5kCYXfF0ixYgK4OXwWJHF3V0V6kYKPZqM7nKxJvKP.Tz5i', 'user', '918765432', 'Rua das Flores, 45, Vila Nova de Gaia'),
('Maria Santos', 'maria.santos@email.pt', '$2y$12$dQPyc8s5kCYXfF0ixYgK4OXwWJHF3V0V6kYKPZqM7nKxJvKP.Tz5i', 'user', '919876543', 'Av. da Liberdade, 78, Porto'),
('Pedro Costa', 'pedro.costa@email.pt', '$2y$12$dQPyc8s5kCYXfF0ixYgK4OXwWJHF3V0V6kYKPZqM7nKxJvKP.Tz5i', 'user', '916543210', 'Rua de Cedofeita, 234, Porto');

-- Inserir Veículos de Teste
INSERT INTO vehicles (brand, model, year, color, fuel_type, kilometers, doors, seats, price, description, status) VALUES 
('BMW', 'Série 3 320d', 2022, 'Preto', 'Diesel', 15000, 4, 5, 45000.00, 'BMW Série 3 em excelente estado, poucos quilómetros, equipamento completo.', 'disponível'),
('Mercedes-Benz', 'Classe A 180', 2023, 'Branco', 'Gasolina', 8000, 4, 5, 38000.00, 'Mercedes Classe A praticamente novo, garantia de fábrica.', 'disponível'),
('Audi', 'A4 Avant 2.0 TDI', 2021, 'Cinzento', 'Diesel', 35000, 4, 5, 42000.00, 'Audi A4 Avant, espaçoso e confortável, ideal para família.', 'disponível'),
('Tesla', 'Model 3', 2023, 'Azul', 'Elétrico', 5000, 4, 5, 52000.00, 'Tesla Model 3 elétrico, tecnologia de ponta, autonomia de 500km.', 'disponível'),
('Volkswagen', 'Golf GTI', 2022, 'Vermelho', 'Gasolina', 18000, 4, 5, 35000.00, 'VW Golf GTI, desportivo e económico.', 'disponível'),
('Toyota', 'RAV4 Hybrid', 2023, 'Prata', 'Híbrido', 12000, 4, 5, 48000.00, 'Toyota RAV4 híbrido, SUV familiar com baixo consumo.', 'disponível'),
('Porsche', '911 Carrera', 2024, 'Amarelo', 'Gasolina', 2000, 2, 4, 125000.00, 'Porsche 911 Carrera, ícone do desporto automóvel.', 'indisponível'),
('Range Rover', 'Evoque', 2022, 'Preto', 'Diesel', 22000, 4, 5, 58000.00, 'Range Rover Evoque, luxo e off-road.', 'disponível'),
('Renault', 'Clio 1.5 dCi', 2020, 'Branco', 'Diesel', 45000, 4, 5, 18000.00, 'Renault Clio económico, perfeito para cidade.', 'disponível'),
('Peugeot', '3008 GT', 2023, 'Cinzento', 'Híbrido', 10000, 4, 5, 42000.00, 'Peugeot 3008 híbrido plug-in, tecnologia e conforto.', 'brevemente');

-- Inserir algumas imagens de veículos (paths fictícios - substituir com imagens reais)
INSERT INTO vehicle_images (vehicle_id, image_path, is_primary) VALUES 
(1, 'bmw_serie3_1.jpg', TRUE),
(1, 'bmw_serie3_2.jpg', FALSE),
(2, 'mercedes_a180_1.jpg', TRUE),
(3, 'audi_a4_1.jpg', TRUE),
(4, 'tesla_model3_1.jpg', TRUE),
(5, 'golf_gti_1.jpg', TRUE),
(6, 'rav4_1.jpg', TRUE),
(7, 'porsche_911_1.jpg', TRUE),
(8, 'evoque_1.jpg', TRUE),
(9, 'clio_1.jpg', TRUE),
(10, 'peugeot_3008_1.jpg', TRUE);

-- Inserir algumas reservas de teste
INSERT INTO test_drives (user_id, vehicle_id, test_date, test_time, status, notes) VALUES 
(2, 1, '2025-12-05', '10:00:00', 'confirmado', 'Cliente interessado no BMW'),
(3, 4, '2025-12-06', '14:00:00', 'pendente', 'Quer testar o Tesla'),
(4, 6, '2025-12-07', '11:00:00', 'confirmado', 'Família interessada no RAV4');
