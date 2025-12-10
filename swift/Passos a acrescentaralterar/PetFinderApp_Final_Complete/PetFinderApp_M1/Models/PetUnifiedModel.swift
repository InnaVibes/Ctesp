import Foundation

struct PetUnifiedModel: Codable {
    let id: String
    let name: String
    let species: String
    let breed: String
    let secondaryBreed: String?
    let sex: String
    let age: String
    let size: String
    let description: String?
    let photoURL: String?
    let largePhotoURL: String?
    let city: String
    let state: String
    
    init(fromAdoptAPet pet: AdoptAPetModel) {
        self.id = pet.petId
        self.name = pet.name
        self.species = pet.species
        self.breed = pet.breeds.primary ?? "Desconhecida"
        self.secondaryBreed = pet.breeds.secondary
        self.sex = pet.sex
        self.age = pet.age
        self.size = pet.size ?? "Medium"
        self.description = pet.description
        self.photoURL = pet.photos?.first?.medium ?? pet.photos?.first?.small
        self.largePhotoURL = pet.photos?.first?.large ?? pet.photos?.first?.full
        self.city = pet.contact?.address?.city ?? ""
        self.state = pet.contact?.address?.state ?? ""
    }
    
    init(fromStatic pet: StaticPetModel) {
        self.id = pet.petId
        self.name = pet.petName
        let breed = pet.primaryBreed.lowercased()
        let catBreeds = ["cat", "persian", "siamese", "bengal", "maine coon", "british shorthair"]
        self.species = catBreeds.contains(where: { breed.contains($0) }) ? "cat" : "dog"
        self.breed = pet.primaryBreed
        self.secondaryBreed = pet.secondaryBreed
        self.sex = pet.sex
        self.age = pet.age
        self.size = pet.size
        self.description = nil
        self.photoURL = pet.resultsPhotoUrl
        self.largePhotoURL = pet.largeResultsPhotoUrl
        self.city = pet.addrCity
        self.state = pet.addrStateCode
    }
}
