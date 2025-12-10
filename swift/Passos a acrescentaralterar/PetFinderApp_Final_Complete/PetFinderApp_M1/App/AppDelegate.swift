import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Incrementar contador de lançamentos
        AchievementsManager.shared.incrementAppLaunchCount()
        
        // Configurar a janela principal
        window = UIWindow(frame: UIScreen.main.bounds)
        
        // Criar TabBarController
        let tabBarController = UITabBarController()
        
        // Home
        let homeVC = HomeViewController()
        let homeNav = UINavigationController(rootViewController: homeVC)
        homeNav.tabBarItem = UITabBarItem(
            title: "Início",
            image: UIImage(systemName: "house"),
            selectedImage: UIImage(systemName: "house.fill")
        )
        
        // Settings
        let settingsVC = SettingsViewController()
        let settingsNav = UINavigationController(rootViewController: settingsVC)
        settingsNav.tabBarItem = UITabBarItem(
            title: "Definições",
            image: UIImage(systemName: "gear"),
            selectedImage: UIImage(systemName: "gear")
        )
        
        tabBarController.viewControllers = [homeNav, settingsNav]
        
        window?.rootViewController = tabBarController
        window?.makeKeyAndVisible()
        
        return true
    }
}
