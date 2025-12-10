import Foundation

extension PetUnifiedModel {
    
    var formattedGender: String {
        switch sex.lowercased() {
        case "male":
            return "Macho"
        case "female":
            return "Fêmea"
        default:
            return "Desconhecido"
        }
    }
    
    var formattedSpecies: String {
        switch species.lowercased() {
        case "dog":
            return "Cão"
        case "cat":
            return "Gato"
        case "rabbit":
            return "Coelho"
        case "bird":
            return "Ave"
        case "horse":
            return "Cavalo"
        case "small_furry", "small-furry":
            return "Pequeno Roedor"
        case "reptile":
            return "Réptil"
        case "barnyard":
            return "Animal de Quinta"
        default:
            return species.capitalized
        }
    }
    
    var formattedAge: String {
        switch age.lowercased() {
        case "baby":
            return "Bebé"
        case "young":
            return "Jovem"
        case "adult":
            return "Adulto"
        case "senior":
            return "Sénior"
        default:
            return age.capitalized
        }
    }
    
    var formattedBreed: String {
        guard let secondary = secondaryBreed else {
            return breed
        }
        return "\(breed) / \(secondary)"
    }
    
    var formattedLocation: String {
        var components: [String] = []
        if !city.isEmpty {
            components.append(city)
        }
        if !state.isEmpty {
            components.append(state)
        }
        return components.isEmpty ? "Localização desconhecida" : components.joined(separator: ", ")
    }
    
    var allPhotoURLs: [String] {
        var urls: [String] = []
        if let photo = photoURL {
            urls.append(photo)
        }
        if let largePhoto = largePhotoURL {
            urls.append(largePhoto)
        }
        return urls
    }
}
