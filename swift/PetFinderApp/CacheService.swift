import Foundation
import CoreData

// MARK: - Cache Service
class CacheService {
    
    static let shared = CacheService()
    
    private let cacheDirectory = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
    private var cacheExpirationTime: TimeInterval = 3600 // 1 hora por padrão
    
    private init() {
        loadCacheSettings()
    }
    
    // MARK: - Configure Cache
    func setCacheExpirationTime(_ seconds: TimeInterval) {
        cacheExpirationTime = seconds
    }
    
    private func loadCacheSettings() {
        if let expirationSeconds = UserDefaults.standard.object(forKey: "cacheExpirationSeconds") as? Double {
            cacheExpirationTime = expirationSeconds
        }
    }
    
    // MARK: - Save to Cache
    func cacheAnimals(_ animals: [Animal], for key: String) {
        do {
            let encoder = JSONEncoder()
            let data = try encoder.encode(animals)
            let url = cacheDirectory.appendingPathComponent("\(key)_animals.cache")
            try data.write(to: url)
            
            // Guardar timestamp
            UserDefaults.standard.set(Date(), forKey: "\(key)_timestamp")
        } catch {
            print("Erro ao fazer cache de animais: \(error)")
        }
    }
    
    func cacheAnimal(_ animal: Animal) {
        do {
            let encoder = JSONEncoder()
            let data = try encoder.encode(animal)
            let url = cacheDirectory.appendingPathComponent("animal_\(animal.id).cache")
            try data.write(to: url)
        } catch {
            print("Erro ao fazer cache de animal: \(error)")
        }
    }
    
    // MARK: - Retrieve from Cache
    func getCachedAnimals(for key: String) -> [Animal]? {
        // Verificar se cache expirou
        if let lastCacheDate = UserDefaults.standard.object(forKey: "\(key)_timestamp") as? Date {
            if Date().timeIntervalSince(lastCacheDate) > cacheExpirationTime {
                // Cache expirada, apagar
                removeCachedAnimals(for: key)
                return nil
            }
        }
        
        do {
            let url = cacheDirectory.appendingPathComponent("\(key)_animals.cache")
            let data = try Data(contentsOf: url)
            let decoder = JSONDecoder()
            let animals = try decoder.decode([Animal].self, from: data)
            return animals
        } catch {
            print("Erro ao ler cache de animais: \(error)")
            return nil
        }
    }
    
    func getCachedAnimal(id: Int) -> Animal? {
        do {
            let url = cacheDirectory.appendingPathComponent("animal_\(id).cache")
            let data = try Data(contentsOf: url)
            let decoder = JSONDecoder()
            let animal = try decoder.decode(Animal.self, from: data)
            return animal
        } catch {
            return nil
        }
    }
    
    // MARK: - Clean Cache
    func removeCachedAnimals(for key: String) {
        do {
            let url = cacheDirectory.appendingPathComponent("\(key)_animals.cache")
            try FileManager.default.removeItem(at: url)
            UserDefaults.standard.removeObject(forKey: "\(key)_timestamp")
        } catch {
            print("Erro ao remover cache: \(error)")
        }
    }
    
    func cleanExpiredCache() {
        let fileManager = FileManager.default
        do {
            let files = try fileManager.contentsOfDirectory(at: cacheDirectory, includingPropertiesForKeys: nil)
            for file in files {
                if file.lastPathComponent.hasSuffix(".cache") {
                    let key = file.lastPathComponent.replacingOccurrences(of: "_animals.cache", with: "")
                        .replacingOccurrences(of: ".cache", with: "")
                    
                    if let lastCacheDate = UserDefaults.standard.object(forKey: "\(key)_timestamp") as? Date {
                        if Date().timeIntervalSince(lastCacheDate) > cacheExpirationTime {
                            try fileManager.removeItem(at: file)
                        }
                    }
                }
            }
        } catch {
            print("Erro ao limpar cache expirada: \(error)")
        }
    }
}
