import Foundation

/// Informação sobre uma foto do animal
/// Contém URLs para diferentes tamanhos da mesma imagem
struct PhotoInfo: Codable {
    /// URL da foto em tamanho pequeno
    let small: String?
    
    /// URL da foto em tamanho médio
    let medium: String?
    
    /// URL da foto em tamanho grande
    let large: String?
    
    /// URL da foto em tamanho original
    let full: String?
}
