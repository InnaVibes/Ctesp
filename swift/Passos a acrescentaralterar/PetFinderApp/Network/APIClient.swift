import Foundation

/// Cliente para comunicação com a API do AdoptAPet
class APIClient {
    
    // MARK: - Propriedades
    
    /// Sessão URLSession configurada
    private let session: URLSession
    
    /// Decoder JSON
    private let decoder: JSONDecoder
    
    // MARK: - Inicialização
    
    init() {
        // Configurar sessão
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = APIConstants.requestTimeout
        config.timeoutIntervalForResource = APIConstants.resourceTimeout
        self.session = URLSession(configuration: config)
        
        // Configurar decoder
        self.decoder = JSONDecoder()
    }
    
    // MARK: - Métodos Públicos
    
    /// Faz uma requisição GET para a API
    /// - Parameters:
    ///   - url: URL completa da requisição
    ///   - completion: Closure chamada com o resultado
    func get<T: Decodable>(
        url: URL,
        completion: @escaping (Result<T, NetworkError>) -> Void
    ) {
        print("🌐 GET: \(url.absoluteString)")
        
        let task = session.dataTask(with: url) { [weak self] data, response, error in
            guard let self = self else { return }
            
            // Verificar erro de rede
            if let error = error {
                DispatchQueue.main.async {
                    completion(.failure(.networkError(error)))
                }
                return
            }
            
            // Verificar resposta HTTP
            guard let httpResponse = response as? HTTPURLResponse else {
                DispatchQueue.main.async {
                    completion(.failure(.invalidResponse))
                }
                return
            }
            
            // Verificar código de status
            guard (200...299).contains(httpResponse.statusCode) else {
                DispatchQueue.main.async {
                    completion(.failure(.httpError(httpResponse.statusCode)))
                }
                return
            }
            
            // Verificar dados
            guard let data = data else {
                DispatchQueue.main.async {
                    completion(.failure(.noData))
                }
                return
            }
            
            // Debug: imprimir resposta
            if let jsonString = String(data: data, encoding: .utf8) {
                print("📥 Response: \(jsonString.prefix(500))...")
            }
            
            // Decodificar
            do {
                let decoded = try self.decoder.decode(T.self, from: data)
                DispatchQueue.main.async {
                    completion(.success(decoded))
                }
            } catch {
                print("❌ Decoding error: \(error)")
                DispatchQueue.main.async {
                    completion(.failure(.decodingError(error)))
                }
            }
        }
        
        task.resume()
    }
}
