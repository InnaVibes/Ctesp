import Foundation

/// Gestor responsável pela sincronização entre API e Core Data
class SyncManager {
    
    // MARK: - Singleton
    
    static let shared = SyncManager()
    private init() {}
    
    // MARK: - Propriedades
    
    /// Network manager
    private let networkManager = NetworkManager.shared
    
    /// Core Data manager
    private let coreDataManager = CoreDataManager.shared
    
    // MARK: - Métodos Públicos
    
    /// Sincroniza os animais da API com o Core Data
    /// - Parameter completion: Closure chamada quando a sincronização termina
    func syncPetsWithCoreData(completion: @escaping (Result<Int, NetworkError>) -> Void) {
        networkManager.fetchPets(forceRefresh: true) { [weak self] result in
            guard let self = self else { return }
            
            switch result {
            case .success(let pets):
                let syncCount = self.savePetsToCoreData(pets)
                print("✅ Sincronizados \(syncCount) novos animais com Core Data")
                completion(.success(syncCount))
                
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    // MARK: - Métodos Privados
    
    /// Guarda os animais da API no Core Data
    /// - Parameter pets: Array de animais da API
    /// - Returns: Número de animais novos adicionados
    private func savePetsToCoreData(_ pets: [PetAPIModel]) -> Int {
        var syncCount = 0
        
        for pet in pets {
            // Converter ID de String para Int64
            guard let petIdInt = Int64(pet.petId) else {
                print("⚠️ ID inválido para pet: \(pet.petId)")
                continue
            }
            
            // Verificar se já existe
            if coreDataManager.fetchAnimal(byId: petIdInt) == nil {
                // Criar novo animal no Core Data
                _ = coreDataManager.saveAnimal(
                    id: petIdInt,
                    name: pet.name,
                    species: pet.formattedSpecies,
                    breed: pet.formattedBreed,
                    gender: pet.formattedGender,
                    age: pet.formattedAge,
                    descriptionText: pet.description,
                    photoURLs: pet.allPhotoURLs.joined(separator: ","),
                    location: pet.formattedLocation
                )
                syncCount += 1
            }
        }
        
        return syncCount
    }
}
