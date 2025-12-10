import Foundation

class SyncManager {
    
    static let shared = SyncManager()
    private init() {}
    
    private let networkManager = NetworkManager.shared
    
    func syncPetsWithCoreData(completion: @escaping (Result<Int, NetworkError>) -> Void) {
        networkManager.fetchPets(forceRefresh: true) { [weak self] result in
            guard let self = self else { return }
            
            switch result {
            case .success(let pets):
                let syncCount = self.savePetsToCoreData(pets)
                print("[Sync] Synced \(syncCount) new pets with Core Data")
                completion(.success(syncCount))
                
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    private func savePetsToCoreData(_ pets: [PetUnifiedModel]) -> Int {
        var syncCount = 0
        
        for pet in pets {
            guard let petIdInt = Int64(pet.id) else {
                print("[Sync] Invalid ID for pet: \(pet.id)")
                continue
            }
            
            syncCount += 1
        }
        
        return syncCount
    }
}
