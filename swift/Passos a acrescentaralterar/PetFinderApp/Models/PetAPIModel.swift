import Foundation

/// Modelo de dados para um animal retornado pela API
struct PetAPIModel: Codable {
    /// ID único do animal
    let petId: String
    
    /// Nome do animal
    let name: String
    
    /// Espécie (dog, cat, etc.)
    let species: String
    
    /// Informação sobre raças
    let breeds: BreedInfo
    
    /// Sexo do animal
    let sex: String
    
    /// Idade do animal
    let age: String
    
    /// Descrição completa (opcional)
    let description: String?
    
    /// Array de fotos (opcional)
    let photos: [PhotoInfo]?
    
    /// Informações de contacto (opcional)
    let contact: ContactInfo?
    
    enum CodingKeys: String, CodingKey {
        case petId = "pet_id"
        case name
        case species
        case breeds
        case sex
        case age
        case description
        case photos
        case contact
    }
}
