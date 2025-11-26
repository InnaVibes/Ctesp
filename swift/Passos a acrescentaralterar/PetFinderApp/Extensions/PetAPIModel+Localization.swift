import Foundation

// MARK: - Conversões para Português

extension PetAPIModel {
    
    /// Converte o sexo da API para português
    /// - Returns: String com o sexo em português
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
    
    /// Converte a espécie da API para português
    /// - Returns: String com a espécie em português
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
    
    /// Converte a idade da API para português
    /// - Returns: String com a idade em português
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
}
