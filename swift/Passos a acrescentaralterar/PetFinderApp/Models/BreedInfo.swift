import Foundation

/// Informação sobre as raças do animal
struct BreedInfo: Codable {
    /// Raça principal
    let primary: String?
    
    /// Raça secundária (para animais mistos)
    let secondary: String?
    
    /// Indica se é raça mista
    let mixed: Bool?
    
    /// Indica se a raça é desconhecida
    let unknown: Bool?
}
