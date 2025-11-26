import Foundation

/// Endereço do abrigo/resgate
struct AddressInfo: Codable {
    /// Linha 1 do endereço
    let address1: String?
    
    /// Linha 2 do endereço (complemento)
    let address2: String?
    
    /// Cidade
    let city: String?
    
    /// Estado/Província
    let state: String?
    
    /// Código postal
    let postcode: String?
    
    /// País
    let country: String?
}
