import Foundation

/// Gestor de cache em memória para animais da API
class CacheManager {
    
    // MARK: - Singleton
    
    static let shared = CacheManager()
    private init() {}
    
    // MARK: - Propriedades
    
    /// Cache de animais em memória
    private var cachedPets: [PetAPIModel] = []
    
    /// Data da última atualização do cache
    private var lastCacheUpdate: Date?
    
    /// Duração do cache em segundos
    private var cacheExpiration: TimeInterval {
        let minutes = UserDefaults.standard.integer(forKey: UserDefaultsKeys.cacheExpirationMinutes)
        let finalMinutes = minutes > 0 ? minutes : UserDefaultsKeys.defaultCacheExpiration
        return TimeInterval(finalMinutes * 60)
    }
    
    // MARK: - Métodos Públicos
    
    /// Verifica se o cache ainda é válido
    var isValid: Bool {
        guard let lastUpdate = lastCacheUpdate else { return false }
        return Date().timeIntervalSince(lastUpdate) < cacheExpiration
    }
    
    /// Obtém os animais do cache
    /// - Returns: Array de animais em cache ou nil se cache inválido
    func getCachedPets() -> [PetAPIModel]? {
        guard isValid else {
            print("📦 Cache expirado")
            return nil
        }
        
        print("📦 Retornando \(cachedPets.count) animais do cache")
        return cachedPets
    }
    
    /// Armazena animais no cache
    /// - Parameter pets: Array de animais para cachear
    func cachePets(_ pets: [PetAPIModel]) {
        cachedPets = pets
        lastCacheUpdate = Date()
        print("💾 \(pets.count) animais armazenados no cache")
    }
    
    /// Limpa o cache de animais
    func clearCache() {
        cachedPets.removeAll()
        lastCacheUpdate = nil
        print("🗑️ Cache limpo")
    }
    
    /// Busca um animal específico no cache
    /// - Parameter petId: ID do animal
    /// - Returns: Animal se encontrado no cache
    func getCachedPet(byId petId: String) -> PetAPIModel? {
        guard isValid else { return nil }
        return cachedPets.first(where: { $0.petId == petId })
    }
}
