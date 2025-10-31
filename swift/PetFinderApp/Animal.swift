import Foundation
import CoreData

// MARK: - Animal Model
struct Animal: Codable, Identifiable {
    let id: Int
    let name: String
    let species: String
    let breed: String
    let gender: String
    let age: String
    let size: String?
    let description: String?
    let photoURLs: [String]?
    let videos: [String]?
    let comments: String?
    let location: Location?
    let organizationId: String?
    let url: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case name
        case species = "type"
        case breed
        case gender
        case age
        case size
        case description
        case photoURLs = "photos"
        case videos
        case comments
        case location
        case organizationId = "organization_id"
        case url
    }
}

// MARK: - Location Model
struct Location: Codable {
    let city: String?
    let state: String?
    let postCode: String?
    let country: String?
    let latitude: Double?
    let longitude: Double?
    
    enum CodingKeys: String, CodingKey {
        case city
        case state
        case postCode = "postcode"
        case country
        case latitude
        case longitude
    }
}

// MARK: - Photo Model
struct Photo: Codable {
    let small: String?
    let medium: String?
    let large: String?
    let full: String?
}

// MARK: - API Response Models
struct PetFinderResponse: Codable {
    let animals: [Animal]
    let pagination: Pagination
    
    enum CodingKeys: String, CodingKey {
        case animals
        case pagination
    }
}

struct Pagination: Codable {
    let countPerPage: Int
    let totalCount: Int
    let currentPage: Int
    let totalPages: Int
    
    enum CodingKeys: String, CodingKey {
        case countPerPage = "count_per_page"
        case totalCount = "total_count"
        case currentPage = "current_page"
        case totalPages = "total_pages"
    }
}

// MARK: - Core Data Entity
@objc(AnimalEntity)
public class AnimalEntity: NSManagedObject {
    @NSManaged public var id: Int64
    @NSManaged public var name: String
    @NSManaged public var species: String
    @NSManaged public var breed: String
    @NSManaged public var gender: String
    @NSManaged public var age: String
    @NSManaged public var descriptionText: String?
    @NSManaged public var photoURLs: String? // Stored as JSON
    @NSManaged public var location: String?
    @NSManaged public var isFollowing: Bool
    @NSManaged public var savedDate: Date?
}

extension AnimalEntity {
    func updateFromAnimal(_ animal: Animal) {
        self.id = Int64(animal.id)
        self.name = animal.name
        self.species = animal.species
        self.breed = animal.breed
        self.gender = animal.gender
        self.age = animal.age
        self.descriptionText = animal.description
        self.savedDate = Date()
        
        if let photos = animal.photoURLs {
            let encoder = JSONEncoder()
            if let data = try? encoder.encode(photos) {
                self.photoURLs = String(data: data, encoding: .utf8)
            }
        }
        
        if let location = animal.location {
            let encoder = JSONEncoder()
            if let data = try? encoder.encode(location) {
                self.location = String(data: data, encoding: .utf8)
            }
        }
    }
}
