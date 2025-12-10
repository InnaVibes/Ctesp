import Foundation

struct StaticPetModel: Codable {
    let petId: String
    let petName: String
    let sex: String
    let age: String
    let size: String
    let primaryBreed: String
    let secondaryBreed: String?
    let addrCity: String
    let addrStateCode: String
    let resultsPhotoUrl: String
    let largeResultsPhotoUrl: String
    
    enum CodingKeys: String, CodingKey {
        case petId = "pet_id"
        case petName = "pet_name"
        case sex, age, size
        case primaryBreed = "primary_breed"
        case secondaryBreed = "secondary_breed"
        case addrCity = "addr_city"
        case addrStateCode = "addr_state_code"
        case resultsPhotoUrl = "results_photo_url"
        case largeResultsPhotoUrl = "large_results_photo_url"
    }
}

struct StaticPetResponse: Codable {
    let status: String
    let pets: [StaticPetModel]
}
