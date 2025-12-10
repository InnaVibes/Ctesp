import Foundation

struct APIURLBuilder {
    
    func buildAdoptAPetURL(apiKey: String, shelterId: String) -> URL? {
        var components = URLComponents(string: APIConstants.adoptAPetBaseURL + APIConstants.adoptAPetEndpoint)
        components?.queryItems = [
            URLQueryItem(name: "key", value: apiKey),
            URLQueryItem(name: "shelter_id", value: shelterId),
            URLQueryItem(name: "output", value: "json"),
            URLQueryItem(name: "v", value: "2"),
            URLQueryItem(name: "start_number", value: "0"),
            URLQueryItem(name: "end_number", value: "500")
        ]
        return components?.url
    }
    
    func buildStaticAllPetsURL() -> URL? {
        let urlString = APIConstants.staticBaseURL + APIConstants.staticAllPetsEndpoint
        return URL(string: urlString)
    }
    
    func buildStaticPetDetailURL(petId: Int) -> URL? {
        let urlString = "\(APIConstants.staticBaseURL)\(APIConstants.staticPetDetailEndpoint)/\(petId).json"
        return URL(string: urlString)
    }
}
