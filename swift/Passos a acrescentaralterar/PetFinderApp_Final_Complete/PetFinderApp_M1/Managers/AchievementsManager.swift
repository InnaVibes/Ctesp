import Foundation
import CoreData
import UIKit
import UserNotifications

class AchievementsManager {
    
    static let shared = AchievementsManager()
    private init() {}
    
    enum AchievementType: String, CaseIterable {
        case firstFollow = "first_follow"
        case follow5 = "follow_5"
        case follow10 = "follow_10"
        case follow25 = "follow_25"
        case visit5 = "visit_5"
        case visit20 = "visit_20"
        
        var title: String {
            switch self {
            case .firstFollow: return "Primeiro Passo"
            case .follow5: return "Colecionador"
            case .follow10: return "Protetor"
            case .follow25: return "Campeão"
            case .visit5: return "Visitante Regular"
            case .visit20: return "Explorador Dedicado"
            }
        }
        
        var description: String {
            switch self {
            case .firstFollow: return "Seguir o primeiro animal"
            case .follow5: return "Seguir 5 animais"
            case .follow10: return "Seguir 10 animais"
            case .follow25: return "Seguir 25 animais"
            case .visit5: return "Abrir a app 5 vezes"
            case .visit20: return "Abrir a app 20 vezes"
            }
        }
        
        var icon: String {
            switch self {
            case .firstFollow: return "star.fill"
            case .follow5: return "heart.circle.fill"
            case .follow10: return "shield.fill"
            case .follow25: return "crown.fill"
            case .visit5: return "eye.fill"
            case .visit20: return "map.fill"
            }
        }
        
        var requiredValue: Int {
            switch self {
            case .firstFollow: return 1
            case .follow5: return 5
            case .follow10: return 10
            case .follow25: return 25
            case .visit5: return 5
            case .visit20: return 20
            }
        }
    }
    
    func getAllAchievements() -> [Achievement] {
        let stats = getUserStats()
        let followingCount = CoreDataManager.shared.getFollowingCount()
        
        return AchievementType.allCases.map { type in
            let isUnlocked = checkIfUnlocked(type: type, stats: stats, followingCount: followingCount)
            let progress = calculateProgress(type: type, stats: stats, followingCount: followingCount)
            
            return Achievement(
                id: type.rawValue,
                title: type.title,
                description: type.description,
                icon: type.icon,
                isUnlocked: isUnlocked,
                progress: progress,
                requiredValue: type.requiredValue
            )
        }
    }
    
    private func checkIfUnlocked(type: AchievementType, stats: UserStatsEntity, followingCount: Int) -> Bool {
        switch type {
        case .firstFollow: return followingCount >= 1
        case .follow5: return followingCount >= 5
        case .follow10: return followingCount >= 10
        case .follow25: return followingCount >= 25
        case .visit5: return stats.appOpenCount >= 5
        case .visit20: return stats.appOpenCount >= 20
        }
    }
    
    private func calculateProgress(type: AchievementType, stats: UserStatsEntity, followingCount: Int) -> Double {
        let currentValue: Int
        
        switch type {
        case .firstFollow, .follow5, .follow10, .follow25:
            currentValue = followingCount
        case .visit5, .visit20:
            currentValue = Int(stats.appOpenCount)
        }
        
        return min(Double(currentValue) / Double(type.requiredValue), 1.0)
    }
    
    func getUserStats() -> UserStatsEntity {
        let context = CoreDataManager.shared.context
        let request: NSFetchRequest<UserStatsEntity> = UserStatsEntity.fetchRequest()
        
        do {
            let results = try context.fetch(request)
            if let stats = results.first {
                return stats
            }
        } catch {
            print("⚠️ Error fetching stats: \(error)")
        }
        
        let newStats = UserStatsEntity(context: context)
        newStats.appOpenCount = 0
        newStats.firstOpenDate = Date()
        newStats.lastOpenDate = Date()
        newStats.totalAnimalsViewed = 0
        newStats.totalSearches = 0
        newStats.totalShares = 0
        
        CoreDataManager.shared.saveContext()
        return newStats
    }
    
    func incrementAppOpenCount() {
        let stats = getUserStats()
        stats.appOpenCount += 1
        stats.lastOpenDate = Date()
        CoreDataManager.shared.saveContext()
        checkForNewAchievements()
    }
    
    func incrementAnimalsViewed() {
        let stats = getUserStats()
        stats.totalAnimalsViewed += 1
        CoreDataManager.shared.saveContext()
        checkForNewAchievements()
    }
    
    func incrementShareCount() {
        let stats = getUserStats()
        stats.totalShares += 1
        CoreDataManager.shared.saveContext()
        checkForNewAchievements()
    }
    
    private func checkForNewAchievements() {
        let achievements = getAllAchievements()
        let newlyUnlocked = achievements.filter { $0.isUnlocked && !wasShownBefore(achievementId: $0.id) }
        
        for achievement in newlyUnlocked {
            showAchievementNotification(achievement: achievement)
            markAsShown(achievementId: achievement.id)
        }
    }
    
    private func wasShownBefore(achievementId: String) -> Bool {
        return UserDefaults.standard.bool(forKey: "achievement_shown_\(achievementId)")
    }
    
    private func markAsShown(achievementId: String) {
        UserDefaults.standard.set(true, forKey: "achievement_shown_\(achievementId)")
    }
    
    private func showAchievementNotification(achievement: Achievement) {
        NotificationCenter.default.post(
            name: NSNotification.Name("AchievementUnlocked"),
            object: nil,
            userInfo: ["achievement": achievement]
        )
    }
    
    func resetAllStats() {
        let stats = getUserStats()
        stats.appOpenCount = 0
        stats.totalAnimalsViewed = 0
        stats.totalSearches = 0
        stats.totalShares = 0
        CoreDataManager.shared.saveContext()
        
        for type in AchievementType.allCases {
            UserDefaults.standard.removeObject(forKey: "achievement_shown_\(type.rawValue)")
        }
    }
}
