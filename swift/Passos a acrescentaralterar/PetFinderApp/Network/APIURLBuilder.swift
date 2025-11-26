import Foundation

/// Construtor de URLs para a API do AdoptAPet
struct APIURLBuilder {
    
    // MARK: - Propriedades
    
    /// Chave da API
    private let apiKey: String
    
    /// ID do abrigo
    private let shelterId: String
    
    // MARK: - Inicialização
    
    init(apiKey: String, shelterId: String) {
        self.apiKey = apiKey
        self.shelterId = shelterId
    }
    
    // MARK: - Métodos Públicos
    
    /// Constrói URL para buscar animais de um abrigo
    /// - Parameters:
    ///   - species: Espécie para filtrar (opcional)
    ///   - startNumber: Índice inicial (paginação)
    ///   - endNumber: Índice final (paginação)
    /// - Returns: URL construída ou nil se inválida
    func buildPetsAtShelterURL(
        species: String? = nil,
        startNumber: Int = 0,
        endNumber: Int = 20
    ) -> URL? {
        var components = URLComponents(string: APIConstants.baseURL + APIConstants.petsAtShelterEndpoint)
        
        var queryItems = [
            URLQueryItem(name: "key", value: apiKey),
            URLQueryItem(name: "shelter_id", value: shelterId),
            URLQueryItem(name: "output", value: APIConstants.outputFormat),
            URLQueryItem(name: "v", value: APIConstants.apiVersion),
            URLQueryItem(name: "start_number", value: String(startNumber)),
            URLQueryItem(name: "end_number", value: String(endNumber))
        ]
        
        // Adicionar filtro de espécie se fornecido
        if let species = species {
            queryItems.append(URLQueryItem(name: "species", value: species))
        }
        
        components?.queryItems = queryItems
        
        return components?.url
    }
}
