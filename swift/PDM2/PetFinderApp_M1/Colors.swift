import UIKit

// MARK: - Color Theme - Tons suaves e naturais
extension UIColor {
    // Cores primárias
    static let petFinderPrimary = UIColor(red: 0.2, green: 0.5, blue: 0.9, alpha: 1.0)      // Azul suave
    static let petFinderPrimaryLight = UIColor(red: 0.4, green: 0.6, blue: 0.95, alpha: 1.0) // Azul claro
    static let petFinderSecondary = UIColor(red: 0.95, green: 0.6, blue: 0.3, alpha: 1.0)    // Laranja suave
    static let petFinderSuccess = UIColor(red: 0.4, green: 0.8, blue: 0.5, alpha: 1.0)       // Verde suave
    static let petFinderWarning = UIColor(red: 1.0, green: 0.7, blue: 0.3, alpha: 1.0)       // Amarelo suave
    static let petFinderDanger = UIColor(red: 0.95, green: 0.4, blue: 0.4, alpha: 1.0)       // Vermelho suave
    
    // Cores de acentuação
    static let petFinderAccent = UIColor(red: 0.95, green: 0.5, blue: 0.7, alpha: 1.0)       // Rosa suave
    static let petFinderNeutral = UIColor(red: 0.9, green: 0.9, blue: 0.92, alpha: 1.0)      // Cinzento claro
}

// MARK: - Tradução PT-PT
struct PTTexts {
    // Geral
    static let app_name = "Pet Finder"
    static let app_subtitle = "Encontre o seu novo amigo"
    
    // Tab titles
    static let tab_animals = "Animais"
    static let tab_favorites = "Favoritos"
    static let tab_achievements = "Conquistas"
    static let tab_settings = "Definições"
    
    // Animal List
    static let animal_list_title = "Animais para Adopção"
    static let animal_list_empty = "Nenhum animal encontrado\n\nToque para recarregar"
    static let animal_list_filter = "Filtros"
    static let animal_breed = "Raça"
    static let animal_gender = "Género"
    static let animal_age = "Idade"
    static let animal_no_details = "Sem detalhes"
    static let animal_follow = "Seguir"
    static let animal_unfollow = "Deixar de Seguir"
    
    // Following/Favorites
    static let favorites_title = "Favoritos"
    static let favorites_empty = "Nenhum animal nos favoritos"
    static let favorites_added = "Adicionado"
    
    // Achievements
    static let achievements_title = "Conquistas"
    static let achievements_empty = "Desbloqueie conquistas\nseguindo animais!"
    static let achievement_first_step = "Primeiro Passo"
    static let achievement_first_step_desc = "Seguir o seu primeiro animal"
    static let achievement_collector = "Colecionador"
    static let achievement_collector_desc = "Seguir 5 animais"
    static let achievement_protector = "Protetor"
    static let achievement_protector_desc = "Seguir 10 animais"
    static let achievement_champion = "Campeão"
    static let achievement_champion_desc = "Seguir 25 animais"
    static let achievement_visitor = "Visitante"
    static let achievement_visitor_desc = "Visitar a aplicação 5 vezes"
    static let achievement_explorer = "Explorador"
    static let achievement_explorer_desc = "Visitar a aplicação 20 vezes"
    static let achievement_unlocked = "Desbloqueado"
    static let achievement_locked = "Bloqueado"
    
    // Settings
    static let settings_title = "Definições"
    static let settings_cache_section = "Armazenamento"
    static let settings_cache_expiration = "Expiração de Armazenamento"
    static let settings_cache_expiration_desc = "Configura quanto tempo os dados são guardados localmente"
    static let settings_items_per_page = "Animais por página"
    static let settings_notifications_section = "Notificações"
    static let settings_daily_notifications = "Notificações Diárias"
    static let settings_notifications_desc = "Receba notificações sobre novos animais"
    static let settings_notification_time = "Hora Preferencial"
    static let settings_general_section = "Geral"
    static let settings_clear_data = "Limpar Todos os Dados"
    static let settings_clear_data_desc = "Esta acção não pode ser desfeita"
    static let settings_notifications_enabled = "Notificações Activadas"
    static let settings_notifications_enabled_msg = "Receberá notificações diárias"
    static let settings_clear_confirm = "Limpar Dados"
    static let settings_clear_confirm_msg = "Tem a certeza que deseja limpar todos os dados? Esta acção não pode ser desfeita."
    static let settings_clear_success = "Sucesso"
    static let settings_clear_success_msg = "Todos os dados foram eliminados."
    static let settings_cache_minutes = "minutos"
    static let settings_items_count = "itens"
    static let settings_cancel = "Cancelar"
    static let settings_clear = "Limpar"
    static let settings_ok = "OK"
    
    // Filters
    static let filter_title = "Filtros"
    static let filter_species = "Espécie"
    static let filter_all_species = "Todos"
    static let filter_dogs = "Cão"
    static let filter_cats = "Gato"
    static let filter_breed_placeholder = "Ex: Labrador"
    static let filter_all_genders = "Todos"
    static let filter_male = "Macho"
    static let filter_female = "Fêmea"
    static let filter_all_ages = "Todos"
    static let filter_baby = "Bebé"
    static let filter_young = "Jovem"
    static let filter_adult = "Adulto"
    static let filter_senior = "Sénior"
    static let filter_apply = "Aplicar Filtros"
    static let filter_clear = "Limpar Filtros"
    
    // Notifications
    static let notification_title = "Novo animal para adopção!"
    static let notification_body = "Descubra um novo amigo hoje"
    static let notification_error = "Erro ao agendar notificação"
    
    // Animal Detail
    static let detail_about = "Sobre"
    static let detail_share = "Partilhar"
    static let detail_contact = "Contactar"
    static let detail_contact_msg = "Em desenvolvimento. Será possível contactar directamente pela aplicação em breve."
    static let detail_species = "Espécie"
    static let detail_location = "Localização"
    static let detail_no_info = "Sem informações disponíveis"
}
