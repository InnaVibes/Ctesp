import Foundation

struct AdoptAPetModel: Codable {
    let petId: String
    let name: String
    let species: String
    let breeds: BreedInfo
    let sex: String
    let age: String
    let size: String?
    let description: String?
    let photos: [PhotoInfo]?
    let contact: ContactInfo?
    
    enum CodingKeys: String, CodingKey {
        case petId = "pet_id"
        case name, species, breeds, sex, age, size, description, photos, contact
    }
}

struct BreedInfo: Codable {
    let primary: String?
    let secondary: String?
    let mixed: Bool?
    let unknown: Bool?
}

struct PhotoInfo: Codable {
    let small: String?
    let medium: String?
    let large: String?
    let full: String?
}

struct ContactInfo: Codable {
    let email: String?
    let phone: String?
    let address: AddressInfo?
}

struct AddressInfo: Codable {
    let city: String?
    let state: String?
    let country: String?
}

struct AdoptAPetResponse: Codable {
    let status: String
    let pets: [AdoptAPetModel]?
    let error: String?
}
