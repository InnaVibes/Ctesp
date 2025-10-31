import UserNotifications
import Foundation

// MARK: - Notification Service
class NotificationService {
    
    static let shared = NotificationService()
    
    private init() {}
    
    // MARK: - Schedule Daily Notification
    func scheduleDailyAnimalNotification(at hour: Int, minute: Int = 0) {
        // Remover notificações antigas
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["dailyAnimal"])
        
        // Fetch um animal aleatório
        PetFinderService.shared.fetchRandomAnimal { result in
            switch result {
            case .success(let animal):
                self.scheduleNotification(title: "Novo animal para adoção!",
                                        body: animal.name,
                                        subtitle: animal.species,
                                        userInfo: ["animalId": animal.id],
                                        at: hour,
                                        minute: minute,
                                        identifier: "dailyAnimal")
            case .failure(let error):
                print("Erro ao buscar animal aleatório: \(error)")
            }
        }
    }
    
    // MARK: - Schedule Custom Notification
    func scheduleNotification(title: String, body: String, subtitle: String? = nil,
                            userInfo: [AnyHashable: Any] = [:],
                            at hour: Int, minute: Int = 0, identifier: String) {
        
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        if let subtitle = subtitle {
            content.subtitle = subtitle
        }
        content.sound = .default
        content.badge = NSNumber(value: UIApplication.shared.applicationIconBadgeNumber + 1)
        content.userInfo = userInfo
        
        // Configurar trigger para hora específica
        var dateComponents = DateComponents()
        dateComponents.hour = hour
        dateComponents.minute = minute
        
        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        let request = UNNotificationRequest(identifier: identifier, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Erro ao agendar notificação: \(error)")
            }
        }
    }
    
    // MARK: - Send Immediate Notification
    func sendImmediateNotification(title: String, body: String, userInfo: [AnyHashable: Any] = [:]) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        content.userInfo = userInfo
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 2, repeats: false)
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Erro ao enviar notificação imediata: \(error)")
            }
        }
    }
    
    // MARK: - Cancel Notification
    func cancelNotification(identifier: String) {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [identifier])
    }
    
    func cancelAllNotifications() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
    }
}
