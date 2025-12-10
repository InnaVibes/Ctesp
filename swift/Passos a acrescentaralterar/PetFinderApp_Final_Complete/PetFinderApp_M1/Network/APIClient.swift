import Foundation

class APIClient {
    
    private let session: URLSession
    private let decoder: JSONDecoder
    
    init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = APIConstants.requestTimeout
        config.timeoutIntervalForResource = APIConstants.resourceTimeout
        self.session = URLSession(configuration: config)
        self.decoder = JSONDecoder()
    }
    
    func get<T: Decodable>(
        url: URL,
        completion: @escaping (Result<T, NetworkError>) -> Void
    ) {
        print("[API] GET: \(url.absoluteString)")
        
        let task = session.dataTask(with: url) { [weak self] data, response, error in
            guard let self = self else { return }
            
            if let error = error {
                DispatchQueue.main.async {
                    completion(.failure(.networkError(error)))
                }
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                DispatchQueue.main.async {
                    completion(.failure(.invalidResponse))
                }
                return
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                DispatchQueue.main.async {
                    completion(.failure(.httpError(httpResponse.statusCode)))
                }
                return
            }
            
            guard let data = data else {
                DispatchQueue.main.async {
                    completion(.failure(.noData))
                }
                return
            }
            
            if let jsonString = String(data: data, encoding: .utf8) {
                print("[API] Response: \(jsonString.prefix(500))...")
            }
            
            do {
                let decoded = try self.decoder.decode(T.self, from: data)
                DispatchQueue.main.async {
                    completion(.success(decoded))
                }
            } catch {
                print("[API] Decoding error: \(error)")
                DispatchQueue.main.async {
                    completion(.failure(.decodingError(error)))
                }
            }
        }
        
        task.resume()
    }
}
