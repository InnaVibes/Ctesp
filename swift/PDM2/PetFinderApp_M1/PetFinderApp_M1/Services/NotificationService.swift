import UserNotifications
import Foundation

/// Serviço responsável pela gestão de notificações locais da aplicação
/// Utiliza o framework UserNotifications para agendar e gerir alertas
/// Implementa o padrão Singleton para garantir uma única instância global
class NotificationService {
    
    // MARK: - Singleton
    
    /// Instância partilhada do serviço de notificações
    /// Acedida através de NotificationService.shared
    static let shared = NotificationService()
    
    /// Inicializador privado para prevenir criação de múltiplas instâncias
    /// Garante que apenas existe uma instância do serviço em toda a aplicação
    private init() {}
    
    // MARK: - Agendamento de Notificações
    
    /// Agenda uma notificação diária recorrente para alertar sobre novos animais
    /// A notificação é disparada todos os dias à hora especificada
    /// Remove automaticamente qualquer notificação diária anterior antes de criar a nova
    ///
    /// - Parameters:
    ///   - hour: Hora do dia para enviar a notificação (formato 24h: 0-23)
    ///   - minute: Minuto da hora para enviar a notificação (predefinido: 0)
    ///
    /// - Note: A notificação só será enviada se o utilizador tiver dado permissão
    /// - Important: Esta notificação repete-se diariamente até ser cancelada
    func scheduleDailyAnimalNotification(at hour: Int, minute: Int = 0) {
        // Remover qualquer notificação diária existente para evitar duplicados
        UNUserNotificationCenter.current().removePendingNotificationRequests(
            withIdentifiers: ["dailyAnimal"]
        )
        
        // Configurar o conteúdo da notificação
        let content = UNMutableNotificationContent()
        content.title = "Novo animal para adoção!"
        content.body = "Descubra um novo amigo hoje"
        content.sound = .default // Som padrão do sistema
        
        // Configurar componentes de data/hora para o agendamento
        var dateComponents = DateComponents()
        dateComponents.hour = hour
        dateComponents.minute = minute
        
        // Criar gatilho de calendário com repetição diária
        // repeats: true faz com que a notificação se repita todos os dias
        let trigger = UNCalendarNotificationTrigger(
            dateMatching: dateComponents,
            repeats: true
        )
        
        // Criar pedido de notificação com identificador único
        let request = UNNotificationRequest(
            identifier: "dailyAnimal",
            content: content,
            trigger: trigger
        )
        
        // Adicionar o pedido ao centro de notificações
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("❌ Erro ao agendar notificação: \(error.localizedDescription)")
            } else {
                print("✅ Notificação diária agendada para as \(String(format: "%02d:%02d", hour, minute))")
            }
        }
    }
    
    // MARK: - Cancelamento de Notificações
    
    /// Cancela uma notificação específica através do seu identificador único
    /// A notificação é removida da lista de notificações pendentes
    ///
    /// - Parameter identifier: Identificador único da notificação a cancelar
    ///
    /// - Example:
    /// ```swift
    /// NotificationService.shared.cancelNotification(identifier: "dailyAnimal")
    /// ```
    func cancelNotification(identifier: String) {
        UNUserNotificationCenter.current().removePendingNotificationRequests(
            withIdentifiers: [identifier]
        )
        print("🔕 Notificação '\(identifier)' cancelada")
    }
    
    /// Cancela todas as notificações pendentes da aplicação
    /// Remove todas as notificações agendadas mas ainda não entregues
    ///
    /// - Warning: Esta operação não pode ser desfeita
    /// - Note: Notificações já entregues não são afetadas
    func cancelAllNotifications() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        print("🔕 Todas as notificações pendentes foram canceladas")
    }
}