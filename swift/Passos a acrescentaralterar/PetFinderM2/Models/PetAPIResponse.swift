import Foundation

/// Resposta principal da API do AdoptAPet
struct PetAPIResponse: Codable {
    /// Status da resposta ("ok" ou "fail")
    let status: String
    
    /// Lista de animais retornada (opcional)
    let pets: [PetAPIModel]?
    
    /// Mensagem de erro (opcional)
    let error: String?
    
    enum CodingKeys: String, CodingKey {
        case status
        case pets
        case error
    }
}
