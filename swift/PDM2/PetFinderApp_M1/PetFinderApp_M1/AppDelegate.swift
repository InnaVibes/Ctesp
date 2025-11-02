import UIKit
import CoreData
import UserNotifications

/// Classe principal da aplicação que gere o ciclo de vida e a configuração inicial
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    // MARK: - Propriedades
    
    /// Janela principal da aplicação
    var window: UIWindow?
    
    /// Contentor persistente para Core Data
    /// Carrega automaticamente o modelo de dados "PetFinderDataModel"
    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "PetFinderDataModel")
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                fatalError("Erro ao carregar stores persistentes: \(error), \(error.userInfo)")
            }
        })
        return container
    }()
    
    /// Contexto de objectos geridos do Core Data
    /// Usado para todas as operações de base de dados
    var managedObjectContext: NSManagedObjectContext {
        return persistentContainer.viewContext
    }
    
    // MARK: - Ciclo de Vida da Aplicação
    
    /// Chamado quando a aplicação termina de ser lançada
    /// Configura a interface principal e as notificações
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Configurar delegado de notificações
        UNUserNotificationCenter.current().delegate = self
        requestNotificationPermission()
        
        // Criar dados de teste (apenas se a base de dados estiver vazia)
        MockData.seedTestData()
        
        // Criar janela principal
        window = UIWindow(frame: UIScreen.main.bounds)
        
        // Criar controlador de separadores (Tab Bar)
        let tabBarController = UITabBarController()
        
        // Tab 1: Lista de Animais
        let animalListVC = AnimalListViewController()
        let animalNavController = UINavigationController(rootViewController: animalListVC)
        animalNavController.tabBarItem = UITabBarItem(
            title: "Animais",
            image: UIImage(systemName: "heart.fill"),
            tag: 0
        )
        
        // Tab 2: Animais Seguidos
        let followingVC = FollowingViewController()
        let followingNavController = UINavigationController(rootViewController: followingVC)
        followingNavController.tabBarItem = UITabBarItem(
            title: "Seguindo",
            image: UIImage(systemName: "star.fill"),
            tag: 1
        )
        
        // Tab 3: Conquistas
        let achievementsVC = AchievementsViewController()
        let achievementsNavController = UINavigationController(rootViewController: achievementsVC)
        achievementsNavController.tabBarItem = UITabBarItem(
            title: "Conquistas",
            image: UIImage(systemName: "trophy.fill"),
            tag: 2
        )
        
        // Tab 4: Definições
        let settingsVC = SettingsViewController()
        let settingsNavController = UINavigationController(rootViewController: settingsVC)
        settingsNavController.tabBarItem = UITabBarItem(
            title: "Definições",
            image: UIImage(systemName: "gear"),
            tag: 3
        )
        
        // Adicionar todos os separadores ao Tab Bar Controller
        tabBarController.viewControllers = [
            animalNavController,
            followingNavController,
            achievementsNavController,
            settingsNavController
        ]
        
        // Definir controlador raiz e tornar janela visível
        window?.rootViewController = tabBarController
        window?.makeKeyAndVisible()
        
        return true
    }
    
    /// Chamado antes da aplicação terminar
    /// Garante que os dados são guardados
    func applicationWillTerminate(_ application: UIApplication) {
        saveContext()
    }
    
    // MARK: - Gestão de Core Data
    
    /// Guarda o contexto do Core Data se houver alterações pendentes
    func saveContext() {
        let context = persistentContainer.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let nserror = error as NSError
                fatalError("Erro ao guardar contexto: \(nserror), \(nserror.userInfo)")
            }
        }
    }
    
    // MARK: - Notificações
    
    /// Solicita permissão ao utilizador para enviar notificações
    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(
            options: [.alert, .sound, .badge]
        ) { granted, error in
            if granted {
                DispatchQueue.main.async {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
        }
    }
}

// MARK: - Delegado de Notificações

extension AppDelegate: UNUserNotificationCenterDelegate {
    
    /// Chamado quando uma notificação é recebida enquanto a app está em primeiro plano
    /// Configura como a notificação deve ser apresentada
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                             willPresent notification: UNNotification,
                             withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        // Mostrar banner, som e badge mesmo com a app aberta
        completionHandler([.banner, .sound, .badge])
    }
}