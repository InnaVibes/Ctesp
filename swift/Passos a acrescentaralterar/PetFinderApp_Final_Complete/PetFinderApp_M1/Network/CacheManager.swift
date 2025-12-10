import Foundation

class CacheManager {
    
    static let shared = CacheManager()
    private init() {}
    
    private var cachedPets: [PetUnifiedModel] = []
    private var lastCacheUpdate: Date?
    
    private var cacheExpiration: TimeInterval {
        let minutes = UserDefaults.standard.integer(forKey: UserDefaultsKeys.cacheExpirationMinutes)
        let finalMinutes = minutes > 0 ? minutes : UserDefaultsKeys.defaultCacheExpiration
        return TimeInterval(finalMinutes * 60)
    }
    
    var isValid: Bool {
        guard let lastUpdate = lastCacheUpdate else { return false }
        return Date().timeIntervalSince(lastUpdate) < cacheExpiration
    }
    
    func getCachedPets() -> [PetUnifiedModel]? {
        guard isValid else {
            print("[Cache] Cache expired")
            return nil
        }
        print("[Cache] Returning \(cachedPets.count) pets from cache")
        return cachedPets
    }
    
    func cachePets(_ pets: [PetUnifiedModel]) {
        cachedPets = pets
        lastCacheUpdate = Date()
        print("[Cache] Cached \(pets.count) pets")
    }
    
    func clearCache() {
        cachedPets.removeAll()
        lastCacheUpdate = nil
        print("[Cache] Cache cleared")
    }
    
    func getCachedPet(byId petId: String) -> PetUnifiedModel? {
        guard isValid else { return nil }
        return cachedPets.first(where: { $0.id == petId })
    }
}
