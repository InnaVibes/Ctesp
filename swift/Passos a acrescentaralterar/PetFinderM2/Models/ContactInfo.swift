import Foundation

/// Informação de contacto do abrigo/resgate
struct ContactInfo: Codable {
    /// Email de contacto
    let email: String?
    
    /// Telefone de contacto
    let phone: String?
    
    /// Endereço do abrigo
    let address: AddressInfo?
}
