import Foundation
import CoreData
import UIKit

/// Gestor de conquistas que verifica progresso em tempo real
class AchievementsManager {
    
    // MARK: - Singleton
    
    static let shared = AchievementsManager()
    private init() {}
    
    // MARK: - Definições de Conquistas
    
    /// Define todas as conquistas disponíveis no app
    enum AchievementType: String, CaseIterable {
        case firstFollow = "first_follow"
        case follow5 = "follow_5"
        case follow10 = "follow_10"
        case follow25 = "follow_25"
        case visit5 = "visit_5"
        case visit20 = "visit_20"
        case view50 = "view_50"
        case share5 = "share_5"
        case weekStreak = "week_streak"
        
        var title: String {
            switch self {
            case .firstFollow: return "Primeiro Passo"
            case .follow5: return "Colecionador"
            case .follow10: return "Protetor"
            case .follow25: return "Campeão"
            case .visit5: return "Visitante Regular"
            case .visit20: return "Explorador Dedicado"
            case .view50: return "Conhecedor"
            case .share5: return "Embaixador"
            case .weekStreak: return "Compromisso de 7 Dias"
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
            case .view50: return "Ver 50 animais diferentes"
            case .share5: return "Partilhar 5 animais"
            case .weekStreak: return "Usar a app 7 dias seguidos"
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
            case .view50: return "book.fill"
            case .share5: return "square.and.arrow.up.fill"
            case .weekStreak: return "calendar.badge.checkmark"
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
            case .view50: return 50
            case .share5: return 5
            case .weekStreak: return 7
            }
        }
    }
    
    // MARK: - Verificação de Conquistas
    
    /// Verifica todas as conquistas e retorna o estado atual
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
    
    /// Verifica se uma conquista específica está desbloqueada
    private func checkIfUnlocked(type: AchievementType, stats: UserStatsEntity, followingCount: Int) -> Bool {
        switch type {
        case .firstFollow:
            return followingCount >= 1
        case .follow5:
            return followingCount >= 5
        case .follow10:
            return followingCount >= 10
        case .follow25:
            return followingCount >= 25
        case .visit5:
            return stats.appOpenCount >= 5
        case .visit20:
            return stats.appOpenCount >= 20
        case .view50:
            return stats.totalAnimalsViewed >= 50
        case .share5:
            return stats.totalShares >= 5
        case .weekStreak:
            return calculateStreak(stats: stats) >= 7
        }
    }
    
    /// Calcula o progresso atual de uma conquista (0.0 a 1.0)
    private func calculateProgress(type: AchievementType, stats: UserStatsEntity, followingCount: Int) -> Double {
        let currentValue: Int
        
        switch type {
        case .firstFollow, .follow5, .follow10, .follow25:
            currentValue = followingCount
        case .visit5, .visit20:
            currentValue = Int(stats.appOpenCount)
        case .view50:
            currentValue = Int(stats.totalAnimalsViewed)
        case .share5:
            currentValue = Int(stats.totalShares)
        case .weekStreak:
            currentValue = calculateStreak(stats: stats)
        }
        
        return min(Double(currentValue) / Double(type.requiredValue), 1.0)
    }
    
    /// Calcula a sequência de dias consecutivos de uso
    private func calculateStreak(stats: UserStatsEntity) -> Int {
        // Por enquanto retorna 0, mas pode implementar lógica de streak
        // verificando datas de abertura consecutivas
        return 0
    }
    
    // MARK: - Gestão de Estatísticas
    
    /// Obtém ou cria as estatísticas do utilizador
    func getUserStats() -> UserStatsEntity {
        let context = CoreDataManager.shared.context
        let request: NSFetchRequest<UserStatsEntity> = UserStatsEntity.fetchRequest()
        
        do {
            let results = try context.fetch(request)
            if let stats = results.first {
                return stats
            }
        } catch {
            print("Erro ao obter estatísticas: \(error)")
        }
        
        // Criar novas estatísticas se não existirem
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
    
    /// Incrementa contador de aberturas da app
    func incrementAppOpenCount() {
        let stats = getUserStats()
        stats.appOpenCount += 1
        stats.lastOpenDate = Date()
        CoreDataManager.shared.saveContext()
        
        // Verificar se desbloqueou nova conquista
        checkForNewAchievements()
    }
    
    /// Incrementa contador de animais visualizados
    func incrementAnimalsViewed() {
        let stats = getUserStats()
        stats.totalAnimalsViewed += 1
        CoreDataManager.shared.saveContext()
        
        checkForNewAchievements()
    }
    
    /// Incrementa contador de partilhas
    func incrementShareCount() {
        let stats = getUserStats()
        stats.totalShares += 1
        CoreDataManager.shared.saveContext()
        
        checkForNewAchievements()
    }
    
    /// Incrementa contador de pesquisas
    func incrementSearchCount() {
        let stats = getUserStats()
        stats.totalSearches += 1
        CoreDataManager.shared.saveContext()
    }
    
    // MARK: - Notificações de Conquistas
    
    /// Verifica e notifica sobre novas conquistas desbloqueadas
    private func checkForNewAchievements() {
        let achievements = getAllAchievements()
        let newlyUnlocked = achievements.filter { $0.isUnlocked && !wasShownBefore(achievementId: $0.id) }
        
        for achievement in newlyUnlocked {
            showAchievementNotification(achievement: achievement)
            markAsShown(achievementId: achievement.id)
        }
    }
    
    /// Verifica se uma conquista já foi mostrada antes
    private func wasShownBefore(achievementId: String) -> Bool {
        let key = "achievement_shown_\(achievementId)"
        return UserDefaults.standard.bool(forKey: key)
    }
    
    /// Marca uma conquista como já mostrada
    private func markAsShown(achievementId: String) {
        let key = "achievement_shown_\(achievementId)"
        UserDefaults.standard.set(true, forKey: key)
    }
    
    /// Mostra notificação in-app de conquista desbloqueada
    private func showAchievementNotification(achievement: Achievement) {
        // Postar notificação para o app mostrar um banner
        NotificationCenter.default.post(
            name: NSNotification.Name("AchievementUnlocked"),
            object: nil,
            userInfo: ["achievement": achievement]
        )
        
        // Também criar uma notificação local
        let content = UNMutableNotificationContent()
        content.title = "🏆 Conquista Desbloqueada!"
        content.body = "\(achievement.title) - \(achievement.description)"
        content.sound = .default
        
        let request = UNNotificationRequest(
            identifier: "achievement_\(achievement.id)",
            content: content,
            trigger: nil // Mostra imediatamente
        )
        
        UNUserNotificationCenter.current().add(request)
    }
    
    // MARK: - Reset (para testes)
    
    /// Reseta todas as estatísticas (apenas para desenvolvimento)
    func resetAllStats() {
        let stats = getUserStats()
        stats.appOpenCount = 0
        stats.totalAnimalsViewed = 0
        stats.totalSearches = 0
        stats.totalShares = 0
        CoreDataManager.shared.saveContext()
        
        // Limpar marcadores de conquistas mostradas
        for type in AchievementType.allCases {
            let key = "achievement_shown_\(type.rawValue)"
            UserDefaults.standard.removeObject(forKey: key)
        }
    }
}

// MARK: - Modelo de Conquista Atualizado

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