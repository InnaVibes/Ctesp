import Foundation

/// Gestor responsável pelas conquistas do utilizador
class AchievementsManager {
    
    // MARK: - Singleton
    
    static let shared = AchievementsManager()
    private init() {}
    
    // MARK: - Propriedades
    
    /// Core Data manager
    private let coreDataManager = CoreDataManager.shared
    
    // MARK: - Métodos Públicos
    
    /// Obtém todas as conquistas disponíveis
    /// - Returns: Array de conquistas com status atualizado
    func getAllAchievements() -> [Achievement] {
        let followingCount = coreDataManager.getFollowingCount()
        
        return [
            Achievement(
                id: 1,
                title: "Primeiro Passo",
                description: "Seguir seu primeiro animal",
                icon: "star.fill",
                isUnlocked: followingCount >= 1
            ),
            Achievement(
                id: 2,
                title: "Colecionador",
                description: "Seguir 5 animais",
                icon: "heart.circle.fill",
                isUnlocked: followingCount >= 5
            ),
            Achievement(
                id: 3,
                title: "Protetor",
                description: "Seguir 10 animais",
                icon: "shield.fill",
                isUnlocked: followingCount >= 10
            ),
            Achievement(
                id: 4,
                title: "Campeão",
                description: "Seguir 25 animais",
                icon: "crown.fill",
                isUnlocked: followingCount >= 25
            ),
            Achievement(
                id: 5,
                title: "Visitante",
                description: "Visitar a app 5 vezes",
                icon: "eye.fill",
                isUnlocked: getAppLaunchCount() >= 5
            ),
            Achievement(
                id: 6,
                title: "Explorador",
                description: "Visitar a app 20 vezes",
                icon: "map.fill",
                isUnlocked: getAppLaunchCount() >= 20
            ),
        ]
    }
    
    /// Obtém o número de conquistas desbloqueadas
    /// - Returns: Número de conquistas desbloqueadas
    func getUnlockedAchievementsCount() -> Int {
        return getAllAchievements().filter { $0.isUnlocked }.count
    }
    
    /// Incrementa o contador de lançamentos da app
    func incrementAppLaunchCount() {
        let currentCount = getAppLaunchCount()
        UserDefaults.standard.set(currentCount + 1, forKey: "appLaunchCount")
    }
    
    // MARK: - Métodos Privados
    
    /// Obtém o número de vezes que a app foi lançada
    /// - Returns: Número de lançamentos
    private func getAppLaunchCount() -> Int {
        return UserDefaults.standard.integer(forKey: "appLaunchCount")
    }
}
