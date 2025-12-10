import Foundation

class NetworkManager {
    
    static let shared = NetworkManager()
    private init() {}
    
    private let apiClient = APIClient()
    private let cacheManager = CacheManager.shared
    private let urlBuilder = APIURLBuilder()
    
    private var apiKey: String {
        UserDefaults.standard.string(forKey: UserDefaultsKeys.apiKey) ?? ""
    }
    
    private var shelterId: String {
        UserDefaults.standard.string(forKey: UserDefaultsKeys.shelterId) ?? ""
    }
    
    private var hasAdoptAPetCredentials: Bool {
        !apiKey.isEmpty && !shelterId.isEmpty
    }
    
    func fetchPets(
        forceRefresh: Bool = false,
        completion: @escaping (Result<[PetUnifiedModel], NetworkError>) -> Void
    ) {
        if !forceRefresh, let cachedPets = cacheManager.getCachedPets() {
            completion(.success(cachedPets))
            return
        }
        
        if hasAdoptAPetCredentials {
            fetchFromAdoptAPet(completion: completion)
        } else {
            print("[Network] No Adopt-a-Pet credentials, using static API")
            fetchFromStaticAPI(completion: completion)
        }
    }
    
    private func fetchFromAdoptAPet(
        completion: @escaping (Result<[PetUnifiedModel], NetworkError>) -> Void
    ) {
        guard let url = urlBuilder.buildAdoptAPetURL(apiKey: apiKey, shelterId: shelterId) else {
            completion(.failure(.invalidURL))
            return
        }
        
        print("[Network] Trying Adopt-a-Pet API")
        
        apiClient.get(url: url) { [weak self] (result: Result<AdoptAPetResponse, NetworkError>) in
            guard let self = self else { return }
            
            switch result {
            case .success(let response):
                if response.status == "ok", let pets = response.pets {
                    let unifiedPets = pets.map { PetUnifiedModel(fromAdoptAPet: $0) }
                    self.cacheManager.cachePets(unifiedPets)
                    print("[Network] Success: \(unifiedPets.count) pets from Adopt-a-Pet")
                    completion(.success(unifiedPets))
                } else {
                    print("[Network] Adopt-a-Pet failed, trying static API")
                    self.fetchFromStaticAPI(completion: completion)
                }
                
            case .failure(let error):
                if case .httpError(let code) = error, (500...503).contains(code) {
                    print("[Network] Adopt-a-Pet 5xx error (\(code)), using static API fallback")
                    self.fetchFromStaticAPI(completion: completion)
                } else if case .networkError = error {
                    print("[Network] Adopt-a-Pet network error, using static API fallback")
                    self.fetchFromStaticAPI(completion: completion)
                } else {
                    completion(.failure(error))
                }
            }
        }
    }
    
    private func fetchFromStaticAPI(
        completion: @escaping (Result<[PetUnifiedModel], NetworkError>) -> Void
    ) {
        guard let url = urlBuilder.buildStaticAllPetsURL() else {
            completion(.failure(.invalidURL))
            return
        }
        
        print("[Network] Using static API fallback")
        
        apiClient.get(url: url) { [weak self] (result: Result<StaticPetResponse, NetworkError>) in
            guard let self = self else { return }
            
            switch result {
            case .success(let response):
                guard response.status == "ok" else {
                    completion(.failure(.apiError("Static API status not OK")))
                    return
                }
                
                let unifiedPets = response.pets.map { PetUnifiedModel(fromStatic: $0) }
                self.cacheManager.cachePets(unifiedPets)
                print("[Network] Success: \(unifiedPets.count) pets from static API (fallback)")
                completion(.success(unifiedPets))
                
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func clearCache() {
        cacheManager.clearCache()
    }
}
