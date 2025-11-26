import Foundation

/// Estrutura que representa uma conquista do utilizador
struct Achievement {
    /// Identificador único da conquista
    let id: Int
    
    /// Título da conquista
    let title: String
    
    /// Descrição de como desbloquear
    let description: String
    
    /// Nome do ícone SF Symbol
    let icon: String
    
    /// Indica se a conquista está desbloqueada
    let isUnlocked: Bool
}
