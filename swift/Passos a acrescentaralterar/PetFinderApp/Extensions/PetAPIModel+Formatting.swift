import Foundation

// MARK: - Extensões de Formatação

extension PetAPIModel {
    
    /// Converte o modelo da API para uma string de localização formatada
    /// - Returns: String formatada com cidade, estado e país
    var formattedLocation: String {
        guard let address = contact?.address else {
            return "Localização desconhecida"
        }
        
        var components: [String] = []
        
        if let city = address.city, !city.isEmpty {
            components.append(city)
        }
        
        if let state = address.state, !state.isEmpty {
            components.append(state)
        }
        
        if let country = address.country, !country.isEmpty {
            components.append(country)
        }
        
        return components.isEmpty ? "Localização desconhecida" : components.joined(separator: ", ")
    }
    
    /// Converte o modelo da API para uma string de raça formatada
    /// - Returns: String formatada com a raça ou raças do animal
    var formattedBreed: String {
        if let primary = breeds.primary, !primary.isEmpty {
            if let secondary = breeds.secondary, !secondary.isEmpty {
                return "\(primary) / \(secondary)"
            }
            return primary
        }
        
        if breeds.mixed == true {
            return "Raça Mista"
        }
        
        if breeds.unknown == true {
            return "Raça Desconhecida"
        }
        
        return "Sem informação de raça"
    }
    
    /// Retorna a URL da foto em tamanho médio
    /// - Returns: URL da primeira foto disponível em tamanho médio ou pequeno
    var photoURL: String? {
        return photos?.first?.medium ?? photos?.first?.small
    }
    
    /// Retorna todas as URLs de fotos disponíveis
    /// - Returns: Array com URLs de todas as fotos em tamanho médio ou pequeno
    var allPhotoURLs: [String] {
        guard let photos = photos else { return [] }
        return photos.compactMap { $0.medium ?? $0.small }
    }
}
