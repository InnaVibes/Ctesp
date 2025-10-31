import Foundation

// MARK: - Achievement Model
struct Achievement {
    let id: String
    let title: String
    let description: String
    let icon: String
    let isUnlocked: Bool
    let unlockedDate: Date?
    let progress: Int // 0-100
}

// MARK: - Achievement Service
class AchievementService {
    
    static let shared = AchievementService()
    
    private let userDefaults = UserDefaults.standard
    private let achievementsKey = "achievements"
    
    private init() {}
    
    // MARK: - Define Achievements
    let achievements: [Achievement] = [
        Achievement(
            id: "first_follow",
            title: "Primeiro Seguido",
            description: "Siga o seu primeiro animal",
            icon: "star.fill",
            isUnlocked: false,
            unlockedDate: nil,
            progress: 0
        ),
        Achievement(
            id: "five_follows",
            title: "Cinco Seguidores",
            description: "Siga 5 animais",
            icon: "star.circle.fill",
            isUnlocked: false,
            unlockedDate: nil,
            progress: 0
        ),
        Achievement(
            id: "ten_follows",
            title: "Dez Seguidores",
            description: "Siga 10 animais",
            icon: "star.circle.fill",
            isUnlocked: false,
            unlockedDate: nil,
            progress: 0
        ),
        Achievement(
            id: "twenty_follows",
            title: "Vinte Seguidores",
            description: "Siga 20 animais",
            icon: "star.circle.fill",
            isUnlocked: false,
            unlockedDate: nil,
            progress: 0
        ),
        Achievement(
            id: "explorer",
            title: "Explorador",
            description: "Veja detalhes de 10 animais",
            icon: "binoculars.circle.fill",
            isUnlocked: false,
            unlockedDate: nil,
            progress: 0
        ),
        Achievement(
            id: "daily_visitor",
            title: "Visitante Diário",
            description: "Abra a app 7 dias seguidos",
            icon: "calendar.circle.fill",
            isUnlocked: false,
            unlockedDate: nil,
            progress: 0
        )
    ]
    
    // MARK: - Unlock Achievement
    func unlockAchievement(_ id: String) {
        var unlockedAchievements = getUnlockedAchievements()
        if !unlockedAchievements.contains(id) {
            unlockedAchievements.append(id)
            userDefaults.set(unlockedAchievements, forKey: achievementsKey)
            userDefaults.set(Date(), forKey: "achievement_\(id)_date")
            
            // Notificar desbloqueio
            NotificationService.shared.sendImmediateNotification(
                title: "Conquista Desbloqueada!",
                body: getAchievementTitle(id)
            )
        }
    }
    
    // MARK: - Get Unlocked Achievements
    func getUnlockedAchievements() -> [String] {
        return userDefaults.stringArray(forKey: achievementsKey) ?? []
    }
    
    // MARK: - Get Achievement Info
    func getAchievementTitle(_ id: String) -> String {
        return achievements.first(where: { $0.id == id })?.title ?? ""
    }
    
    func getAchievementDescription(_ id: String) -> String {
        return achievements.first(where: { $0.id == id })?.description ?? ""
    }
    
    func getAchievementIcon(_ id: String) -> String {
        return achievements.first(where: { $0.id == id })?.icon ?? "star.fill"
    }
    
    // MARK: - Update Progress
    func updateFollowingProgress(count: Int) {
        if count == 1 {
            unlockAchievement("first_follow")
        } else if count == 5 {
            unlockAchievement("five_follows")
        } else if count == 10 {
            unlockAchievement("ten_follows")
        } else if count == 20 {
            unlockAchievement("twenty_follows")
        }
    }
    
    func updateViewProgress(count: Int) {
        if count >= 10 {
            unlockAchievement("explorer")
        }
    }
    
    func updateDailyVisitProgress() {
        let lastVisitKey = "last_daily_visit"
        let today = Calendar.current.startOfDay(for: Date())
        
        if let lastVisit = userDefaults.object(forKey: lastVisitKey) as? Date {
            let lastVisitDay = Calendar.current.startOfDay(for: lastVisit)
            if Calendar.current.dateComponents([.day], from: lastVisitDay, to: today).day == 1 {
                var streak = userDefaults.integer(forKey: "daily_visit_streak")
                streak += 1
                userDefaults.set(streak, forKey: "daily_visit_streak")
                
                if streak >= 7 {
                    unlockAchievement("daily_visitor")
                }
            }
        }
        
        userDefaults.set(today, forKey: lastVisitKey)
    }
}
