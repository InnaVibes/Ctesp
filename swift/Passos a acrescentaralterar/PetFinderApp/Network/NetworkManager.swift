import Foundation

/// Serviço responsável pela comunicação com a API do AdoptAPet
/// Coordena APIClient, CacheManager e sincronização com Core Data
class NetworkManager {
    
    // MARK: - Singleton
    
    static let shared = NetworkManager()
    private init() {}
    
    // MARK: - Propriedades
    
    /// Cliente de API
    private let apiClient = APIClient()
    
    /// Gestor de cache
    private let cacheManager = CacheManager.shared
    
    /// Chave da API
    private var apiKey: String {
        return UserDefaults.standard.string(forKey: UserDefaultsKeys.apiKey) ?? ""
    }
    
    /// ID do abrigo
    private var shelterId: String {
        return UserDefaults.standard.string(forKey: UserDefaultsKeys.shelterId) ?? ""
    }
    
    /// Verifica se as credenciais da API estão configuradas
    var hasValidCredentials: Bool {
        return !apiKey.isEmpty && !shelterId.isEmpty
    }
    
    // MARK: - Métodos Públicos
    
    /// Obtém a lista de animais disponíveis
    /// - Parameters:
    ///   - species: Espécie para filtrar (opcional)
    ///   - page: Número da página (para paginação)
    ///   - limit: Número de resultados por página
    ///   - forceRefresh: Se true, ignora o cache e força uma nova requisição
    ///   - completion: Closure chamada com o resultado
    func fetchPets(
        species: String? = nil,
        page: Int = 1,
        limit: Int = 20,
        forceRefresh: Bool = false,
        completion: @escaping (Result<[PetAPIModel], NetworkError>) -> Void
    ) {
        // Verificar cache se não for forçado refresh
        if !forceRefresh, let cachedPets = cacheManager.getCachedPets() {
            completion(.success(cachedPets))
            return
        }
        
        // Validar credenciais
        guard hasValidCredentials else {
            completion(.failure(.missingCredentials))
            return
        }
        
        // Construir URL
        let urlBuilder = APIURLBuilder(apiKey: apiKey, shelterId: shelterId)
        let startNumber = (page - 1) * limit
        let endNumber = page * limit
        
        guard let url = urlBuilder.buildPetsAtShelterURL(
            species: species,
            startNumber: startNumber,
            endNumber: endNumber
        ) else {
            completion(.failure(.invalidURL))
            return
        }
        
        // Fazer requisição
        apiClient.get(url: url) { [weak self] (result: Result<PetAPIResponse, NetworkError>) in
            guard let self = self else { return }
            
            switch result {
            case .success(let response):
                if response.status == "ok" {
                    let pets = response.pets ?? []
                    
                    // Atualizar cache
                    self.cacheManager.cachePets(pets)
                    
                    print("✅ \(pets.count) animais recebidos da API")
                    completion(.success(pets))
                } else {
                    let errorMessage = response.error ?? "Erro desconhecido"
                    print("❌ Erro da API: \(errorMessage)")
                    completion(.failure(.apiError(errorMessage)))
                }
                
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    /// Obtém detalhes de um animal específico
    /// - Parameters:
    ///   - petId: ID do animal
    ///   - completion: Closure chamada com o resultado
    func fetchPetDetails(
        petId: String,
        completion: @escaping (Result<PetAPIModel, NetworkError>) -> Void
    ) {
        // Primeiro verificar se está no cache
        if let cachedPet = cacheManager.getCachedPet(byId: petId) {
            completion(.success(cachedPet))
            return
        }
        
        // Se não estiver no cache, buscar da API
        fetchPets { result in
            switch result {
            case .success(let pets):
                if let pet = pets.first(where: { $0.petId == petId }) {
                    completion(.success(pet))
                } else {
                    completion(.failure(.petNotFound))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    /// Limpa o cache de animais
    func clearCache() {
        cacheManager.clearCache()
    }
}
