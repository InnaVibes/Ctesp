import UIKit
import CoreData
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    
    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "PetFinderDataModel")
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
        return container
    }()
    
    var managedObjectContext: NSManagedObjectContext {
        return persistentContainer.viewContext
    }
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        UNUserNotificationCenter.current().delegate = self
        requestNotificationPermission()
        
        window = UIWindow(frame: UIScreen.main.bounds)
        
        let tabBarController = UITabBarController()
        
        let animalListVC = AnimalListViewController()
        let animalNavController = UINavigationController(rootViewController: animalListVC)
        animalNavController.tabBarItem = UITabBarItem(title: "Animais", image: UIImage(systemName: "heart.fill"), tag: 0)
        
        let followingVC = FollowingViewController()
        let followingNavController = UINavigationController(rootViewController: followingVC)
        followingNavController.tabBarItem = UITabBarItem(title: "Seguindo", image: UIImage(systemName: "star.fill"), tag: 1)
        
        let achievementsVC = AchievementsViewController()
        let achievementsNavController = UINavigationController(rootViewController: achievementsVC)
        achievementsNavController.tabBarItem = UITabBarItem(title: "Conquistas", image: UIImage(systemName: "trophy.fill"), tag: 2)
        
        let settingsVC = SettingsViewController()
        let settingsNavController = UINavigationController(rootViewController: settingsVC)
        settingsNavController.tabBarItem = UITabBarItem(title: "Definições", image: UIImage(systemName: "gear"), tag: 3)
        
        tabBarController.viewControllers = [animalNavController, followingNavController, achievementsNavController, settingsNavController]
        
        window?.rootViewController = tabBarController
        window?.makeKeyAndVisible()
        
        return true
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
        saveContext()
    }
    
    func saveContext() {
        let context = persistentContainer.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let nserror = error as NSError
                fatalError("Unresolved error \(nserror), \(nserror.userInfo)")
            }
        }
    }
    
    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                DispatchQueue.main.async {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
        }
    }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                             willPresent notification: UNNotification,
                             withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound, .badge])
    }
}
