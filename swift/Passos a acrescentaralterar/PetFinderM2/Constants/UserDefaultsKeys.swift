import Foundation

/// Chaves para armazenamento em UserDefaults
enum UserDefaultsKeys {
    
    // MARK: - API
    
    /// Chave para API Key
    static let apiKey = "apiKey"
    
    /// Chave para Shelter ID
    static let shelterId = "shelterId"
    
    // MARK: - Cache
    
    /// Chave para tempo de expiração do cache (em minutos)
    static let cacheExpirationMinutes = "cacheExpirationMinutes"
    
    /// Chave para número de itens por página
    static let itemsPerPage = "itemsPerPage"
    
    // MARK: - Notificações
    
    /// Chave para estado das notificações diárias
    static let dailyNotificationsEnabled = "dailyNotificationsEnabled"
    
    /// Chave para hora preferencial das notificações
    static let notificationHour = "notificationHour"
    
    // MARK: - Valores Padrão
    
    /// Tempo padrão de expiração do cache (minutos)
    static let defaultCacheExpiration = 60
    
    /// Número padrão de itens por página
    static let defaultItemsPerPage = 20
    
    /// Hora padrão para notificações
    static let defaultNotificationHour = 9
}
