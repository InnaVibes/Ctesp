import Foundation
import CoreData

@objc(PetUnifiedModel)
public class PetUnifiedModel: NSManagedObject, Codable {
    
    @NSManaged public var id: String
    @NSManaged public var name: String
    @NSManaged public var species: String
    @NSManaged public var breed: String
    @NSManaged public var secondaryBreed: String?
    @NSManaged public var sex: String
    @NSManaged public var age: String
    @NSManaged public var size: String
    @NSManaged public var descriptionText: String?
    @NSManaged public var photoURL: String?
    @NSManaged public var largePhotoURL: String?
    @NSManaged public var city: String
    @NSManaged public var state: String
    @NSManaged public var isFollowing: Bool
    @NSManaged public var savedDate: Date?
    
    enum CodingKeys: String, CodingKey {
        case id, name, species, breed, secondaryBreed, sex, age, size
        case descriptionText = "description"
        case photoURL, largePhotoURL, city, state
    }
    
    required convenience public init(from decoder: Decoder) throws {
        guard let context = decoder.userInfo[.managedObjectContext] as? NSManagedObjectContext else {
            fatalError("NSManagedObjectContext required")
        }
        
        self.init(context: context)
        
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)
        self.name = try container.decode(String.self, forKey: .name)
        self.species = try container.decode(String.self, forKey: .species)
        self.breed = try container.decode(String.self, forKey: .breed)
        self.secondaryBreed = try container.decodeIfPresent(String.self, forKey: .secondaryBreed)
        self.sex = try container.decode(String.self, forKey: .sex)
        self.age = try container.decode(String.self, forKey: .age)
        self.size = try container.decode(String.self, forKey: .size)
        self.descriptionText = try container.decodeIfPresent(String.self, forKey: .descriptionText)
        self.photoURL = try container.decodeIfPresent(String.self, forKey: .photoURL)
        self.largePhotoURL = try container.decodeIfPresent(String.self, forKey: .largePhotoURL)
        self.city = try container.decode(String.self, forKey: .city)
        self.state = try container.decode(String.self, forKey: .state)
        self.isFollowing = false
        self.savedDate = nil
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encode(species, forKey: .species)
        try container.encode(breed, forKey: .breed)
        try container.encodeIfPresent(secondaryBreed, forKey: .secondaryBreed)
        try container.encode(sex, forKey: .sex)
        try container.encode(age, forKey: .age)
        try container.encode(size, forKey: .size)
        try container.encodeIfPresent(descriptionText, forKey: .descriptionText)
        try container.encodeIfPresent(photoURL, forKey: .photoURL)
        try container.encodeIfPresent(largePhotoURL, forKey: .largePhotoURL)
        try container.encode(city, forKey: .city)
        try container.encode(state, forKey: .state)
    }
    
    convenience init(context: NSManagedObjectContext, fromAdoptAPet pet: AdoptAPetModel) {
        self.init(context: context)
        self.id = pet.petId
        self.name = pet.name
        self.species = pet.species
        self.breed = pet.breeds.primary ?? "Desconhecida"
        self.secondaryBreed = pet.breeds.secondary
        self.sex = pet.sex
        self.age = pet.age
        self.size = pet.size ?? "Medium"
        self.descriptionText = pet.description
        self.photoURL = pet.photos?.first?.medium ?? pet.photos?.first?.small
        self.largePhotoURL = pet.photos?.first?.large ?? pet.photos?.first?.full
        self.city = pet.contact?.address?.city ?? ""
        self.state = pet.contact?.address?.state ?? ""
        self.isFollowing = false
        self.savedDate = nil
    }
    
    convenience init(context: NSManagedObjectContext, fromStatic pet: StaticPetModel) {
        self.init(context: context)
        self.id = pet.petId
        self.name = pet.petName
        let breedLower = pet.primaryBreed.lowercased()
        let catBreeds = ["cat", "persian", "siamese", "bengal", "maine coon", "british shorthair"]
        self.species = catBreeds.contains(where: { breedLower.contains($0) }) ? "cat" : "dog"
        self.breed = pet.primaryBreed
        self.secondaryBreed = pet.secondaryBreed
        self.sex = pet.sex
        self.age = pet.age
        self.size = pet.size
        self.descriptionText = nil
        self.photoURL = pet.resultsPhotoUrl
        self.largePhotoURL = pet.largeResultsPhotoUrl
        self.city = pet.addrCity
        self.state = pet.addrStateCode
        self.isFollowing = false
        self.savedDate = nil
    }
}

extension PetUnifiedModel {
    
    @nonobjc public class func fetchRequest() -> NSFetchRequest<PetUnifiedModel> {
        return NSFetchRequest<PetUnifiedModel>(entityName: "PetUnifiedModel")
    }
}

extension CodingUserInfoKey {
    static let managedObjectContext = CodingUserInfoKey(rawValue: "managedObjectContext")!
}
