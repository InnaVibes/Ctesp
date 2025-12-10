import Foundation

class AchievementsManager {
    
    static let shared = AchievementsManager()
    private init() {}
    
    func getAllAchievements() -> [Achievement] {
        let followingCount = 0
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
            )
        ]
    }
    
    func getUnlockedAchievementsCount() -> Int {
        return getAllAchievements().filter { $0.isUnlocked }.count
    }
    
    func incrementAppLaunchCount() {
        let count = getAppLaunchCount()
        UserDefaults.standard.set(count + 1, forKey: UserDefaultsKeys.appLaunchCount)
    }
    
    private func getAppLaunchCount() -> Int {
        return UserDefaults.standard.integer(forKey: UserDefaultsKeys.appLaunchCount)
    }
}
