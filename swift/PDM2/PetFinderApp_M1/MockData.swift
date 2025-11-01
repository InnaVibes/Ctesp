import Foundation

struct MockData {
    static func seedTestData() {
        // Only seed if database is empty
        if CoreDataManager.shared.getTotalAnimalsCount() == 0 {
            let animals = [
                // Dogs
                AnimalData(
                    id: 1,
                    name: "Rex",
                    species: "Cão",
                    breed: "Labrador Retriever",
                    gender: "Macho",
                    age: "2 anos",
                    description: "Cão amigável, brincalhão e muito carinhoso. Adora correr e brincar com bolas.",
                    location: "Porto"
                ),
                AnimalData(
                    id: 2,
                    name: "Bella",
                    species: "Cão",
                    breed: "Golden Retriever",
                    gender: "Fêmea",
                    age: "3 anos",
                    description: "Dócil e muito sociável. Perfeita para famílias com crianças.",
                    location: "Matosinhos"
                ),
                AnimalData(
                    id: 3,
                    name: "Max",
                    species: "Cão",
                    breed: "Pastor Alemão",
                    gender: "Macho",
                    age: "4 anos",
                    description: "Inteligente e leal. Muito protetor da família.",
                    location: "Vila Nova de Gaia"
                ),
                AnimalData(
                    id: 4,
                    name: "Luna",
                    species: "Cão",
                    breed: "Husky Siberiano",
                    gender: "Fêmea",
                    age: "2 anos",
                    description: "Energética e aventureira. Adora caminhadas e corridas.",
                    location: "Espinho"
                ),
                AnimalData(
                    id: 5,
                    name: "Charlie",
                    species: "Cão",
                    breed: "Bulldog Francês",
                    gender: "Macho",
                    age: "1 ano",
                    description: "Pequenino, cheio de personalidade. Perfeito para apartamentos.",
                    location: "Gondomar"
                ),
                
                // Cats
                AnimalData(
                    id: 6,
                    name: "Miau",
                    species: "Gato",
                    breed: "Persa",
                    gender: "Fêmea",
                    age: "1 ano",
                    description: "Gato calmo e tranquilo. Adora carinho e sestas ao sol.",
                    location: "Porto"
                ),
                AnimalData(
                    id: 7,
                    name: "Félix",
                    species: "Gato",
                    breed: "Siamês",
                    gender: "Macho",
                    age: "2 anos",
                    description: "Muito vocal e brincalhão. Gosta de estar no colo.",
                    location: "Maia"
                ),
                AnimalData(
                    id: 8,
                    name: "Whiskers",
                    species: "Gato",
                    breed: "Gato de Rua",
                    gender: "Macho",
                    age: "3 anos",
                    description: "Resgatado da rua. Já está habituado à vida doméstica.",
                    location: "Valongo"
                ),
                AnimalData(
                    id: 9,
                    name: "Nala",
                    species: "Gato",
                    breed: "Gato Doméstico",
                    gender: "Fêmea",
                    age: "2 anos",
                    description: "Gata independente mas carinhosa. Gosta de brincar com ratinhos.",
                    location: "São Mamede de Infesta"
                ),
                AnimalData(
                    id: 10,
                    name: "Garfield",
                    species: "Gato",
                    breed: "Gato de Rua",
                    gender: "Macho",
                    age: "5 anos",
                    description: "Adulto, tranquilo. Procura um lar calmo e confortável.",
                    location: "Ermesinde"
                ),
                
                // More Dogs
                AnimalData(
                    id: 11,
                    name: "Buddy",
                    species: "Cão",
                    breed: "Cocker Spaniel",
                    gender: "Macho",
                    age: "1 ano",
                    description: "Muito sociável e dócil. Adora água e nadar.",
                    location: "Maia"
                ),
                AnimalData(
                    id: 12,
                    name: "Daisy",
                    species: "Cão",
                    breed: "Beagle",
                    gender: "Fêmea",
                    age: "3 anos",
                    description: "Pequena mas cheia de energia. Adora farejar e explorar.",
                    location: "Aveiro"
                ),
                AnimalData(
                    id: 13,
                    name: "Thor",
                    species: "Cão",
                    breed: "São Bernardo",
                    gender: "Macho",
                    age: "4 anos",
                    description: "Grande, suave e gentil. Excelente para famílias.",
                    location: "Santa Maria da Feira"
                ),
                AnimalData(
                    id: 14,
                    name: "Molly",
                    species: "Cão",
                    breed: "Poodle",
                    gender: "Fêmea",
                    age: "2 anos",
                    description: "Inteligente e fácil de treinar. Precisa de cuidados regulares.",
                    location: "Oliveira de Azeméis"
                ),
                
                // More Cats
                AnimalData(
                    id: 15,
                    name: "Simba",
                    species: "Gato",
                    breed: "Gato Doméstico",
                    gender: "Macho",
                    age: "1 ano",
                    description: "Jovem e cheio de energia. Excelente para casas com jardim.",
                    location: "Vila do Conde"
                ),
            ]
            
            // Save all animals to CoreData
            for animal in animals {
                CoreDataManager.shared.saveAnimal(
                    id: animal.id,
                    name: animal.name,
                    species: animal.species,
                    breed: animal.breed,
                    gender: animal.gender,
                    age: animal.age,
                    descriptionText: animal.description,
                    photoURLs: nil,
                    location: animal.location
                )
            }
            
            print("✅ Mock data criado: \(animals.count) animais adicionados")
        }
    }
}

// Helper struct for mock data
private struct AnimalData {
    let id: Int64
    let name: String
    let species: String
    let breed: String
    let gender: String
    let age: String
    let description: String
    let location: String
}
