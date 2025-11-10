import Foundation

// MARK: - PetFinder API Service
class PetFinderService {
    
    static let shared = PetFinderService()
    
    private let baseURL = "https://api.petfinder.com/v2"
    private let clientId = "YOUR_PETFINDER_CLIENT_ID" // TODO: Substituir com ID real
    private let clientSecret = "YOUR_PETFINDER_CLIENT_SECRET" // TODO: Substituir com secret real
    private var accessToken: String?
    private var tokenExpiration: Date?
    
    private let session = URLSession.shared
    
    private init() {}
    
    // MARK: - Authentication
    func authenticate(completion: @escaping (Bool) -> Void) {
        let authURL = URL(string: "\(baseURL)/oauth2/token")!
        var request = URLRequest(url: authURL)
        request.httpMethod = "POST"
        
        let parameters = [
            "grant_type": "client_credentials",
            "client_id": clientId,
            "client_secret": clientSecret
        ]
        
        request.httpBody = parameters.map { "\($0.key)=\($0.value)" }.joined(separator: "&").data(using: .utf8)
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        session.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                completion(false)
                return
            }
            
            do {
                let tokenResponse = try JSONDecoder().decode(TokenResponse.self, from: data)
                self.accessToken = tokenResponse.accessToken
                self.tokenExpiration = Date().addingTimeInterval(TimeInterval(tokenResponse.expiresIn))
                completion(true)
            } catch {
                completion(false)
            }
        }.resume()
    }
    
    // MARK: - Fetch Animals
    func fetchAnimals(species: String = "", breed: String = "", gender: String = "",
                      age: String = "", page: Int = 1, limit: Int = 20,
                      location: String = "PT", completion: @escaping (Result<PetFinderResponse, Error>) -> Void) {
        
        guard let token = accessToken else {
            authenticate { success in
                if success {
                    self.fetchAnimals(species: species, breed: breed, gender: gender,
                                    age: age, page: page, limit: limit, location: location, completion: completion)
                } else {
                    completion(.failure(APIError.authenticationFailed))
                }
            }
            return
        }
        
        var urlComponents = URLComponents(string: "\(baseURL)/animals")!
        var queryItems: [URLQueryItem] = [
            URLQueryItem(name: "page", value: String(page)),
            URLQueryItem(name: "limit", value: String(limit)),
            URLQueryItem(name: "location", value: location)
        ]
        
        if !species.isEmpty {
            queryItems.append(URLQueryItem(name: "type", value: species))
        }
        if !breed.isEmpty {
            queryItems.append(URLQueryItem(name: "breed", value: breed))
        }
        if !gender.isEmpty {
            queryItems.append(URLQueryItem(name: "gender", value: gender))
        }
        if !age.isEmpty {
            queryItems.append(URLQueryItem(name: "age", value: age))
        }
        
        urlComponents.queryItems = queryItems
        
        guard let url = urlComponents.url else {
            completion(.failure(APIError.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        session.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(APIError.noData))
                return
            }
            
            do {
                let decoder = JSONDecoder()
                let response = try decoder.decode(PetFinderResponse.self, from: data)
                completion(.success(response))
            } catch {
                completion(.failure(APIError.decodingError(error)))
            }
        }.resume()
    }
    
    // MARK: - Fetch Animal Detail
    func fetchAnimalDetail(id: Int, completion: @escaping (Result<Animal, Error>) -> Void) {
        guard let token = accessToken else {
            authenticate { success in
                if success {
                    self.fetchAnimalDetail(id: id, completion: completion)
                } else {
                    completion(.failure(APIError.authenticationFailed))
                }
            }
            return
        }
        
        let url = URL(string: "\(baseURL)/animals/\(id)")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        session.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(APIError.noData))
                return
            }
            
            do {
                let wrapper = try JSONDecoder().decode(AnimalDetailWrapper.self, from: data)
                completion(.success(wrapper.animal))
            } catch {
                completion(.failure(APIError.decodingError(error)))
            }
        }.resume()
    }
    
    // MARK: - Fetch Random Animal
    func fetchRandomAnimal(completion: @escaping (Result<Animal, Error>) -> Void) {
        fetchAnimals(page: 1, limit: 1) { result in
            switch result {
            case .success(let response):
                if let randomAnimal = response.animals.randomElement() {
                    completion(.success(randomAnimal))
                } else {
                    completion(.failure(APIError.noAnimalFound))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
}

// MARK: - Supporting Structures
struct TokenResponse: Codable {
    let accessToken: String
    let tokenType: String
    let expiresIn: Int
    
    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case tokenType = "token_type"
        case expiresIn = "expires_in"
    }
}

struct AnimalDetailWrapper: Codable {
    let animal: Animal
}

// MARK: - Error Handling
enum APIError: Error {
    case authenticationFailed
    case invalidURL
    case noData
    case decodingError(Error)
    case noAnimalFound
    
    var localizedDescription: String {
        switch self {
        case .authenticationFailed:
            return "Falha na autenticação com a API"
        case .invalidURL:
            return "URL inválida"
        case .noData:
            return "Nenhum dado recebido"
        case .decodingError(let error):
            return "Erro ao descodificar: \(error.localizedDescription)"
        case .noAnimalFound:
            return "Nenhum animal encontrado"
        }
    }
}
