import Foundation

/// Constantes relacionadas com a API do AdoptAPet
enum APIConstants {
    
    // MARK: - URLs
    
    /// URL base da API
    static let baseURL = "https://api.adoptapet.com"
    
    /// Endpoint para buscar animais de um abrigo
    static let petsAtShelterEndpoint = "/search/pets_at_shelter"
    
    // MARK: - Parâmetros
    
    /// Versão da API
    static let apiVersion = "2"
    
    /// Formato de saída
    static let outputFormat = "json"
    
    // MARK: - Limites
    
    /// Número máximo de pets por requisição
    static let maxPetsPerRequest = 500
    
    /// Número máximo total de pets
    static let maxTotalPets = 10000
    
    // MARK: - Timeouts
    
    /// Timeout para requisição (segundos)
    static let requestTimeout: TimeInterval = 30
    
    /// Timeout para recurso (segundos)
    static let resourceTimeout: TimeInterval = 60
}
