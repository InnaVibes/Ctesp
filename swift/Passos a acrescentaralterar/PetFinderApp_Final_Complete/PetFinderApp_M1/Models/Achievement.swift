import Foundation

struct Achievement {
    let id: String
    let title: String
    let description: String
    let icon: String
    let isUnlocked: Bool
    let progress: Double
    let requiredValue: Int
    
    var progressText: String {
        let current = Int(progress * Double(requiredValue))
        return "\(current)/\(requiredValue)"
    }
}
