import Foundation

enum APIConstants {
    
    // MARK: - Primary API: Adopt-a-Pet
    static let adoptAPetBaseURL = "https://api.adoptapet.com"
    static let adoptAPetEndpoint = "/search/pets_at_shelter"
    
    // MARK: - Fallback API: Static JSON
    static let staticBaseURL = "https://carlos-aldeias-estg.github.io/pdm2-2025-mock-api"
    static let staticAllPetsEndpoint = "/api/pets.json"
    static let staticPetDetailEndpoint = "/api/pets"
    
    // MARK: - Timeouts
    static let requestTimeout: TimeInterval = 30
    static let resourceTimeout: TimeInterval = 60
    
    // MARK: - Cache
    static let defaultCacheMinutes = 30
}
