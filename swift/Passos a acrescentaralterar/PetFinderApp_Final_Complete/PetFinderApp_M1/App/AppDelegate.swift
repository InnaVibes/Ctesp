import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Incrementar contador de lançamentos
        AchievementsManager.shared.incrementAppOpenCount()
        
        // Configurar a janela principal
        window = UIWindow(frame: UIScreen.main.bounds)
        
        // Criar TabBarController
        let tabBarController = UITabBarController()
        
        // Home Tab
        let homeVC = HomeViewController()
        let homeNav = UINavigationController(rootViewController: homeVC)
        homeNav.tabBarItem = UITabBarItem(
            title: "Início",
            image: UIImage(systemName: "house"),
            selectedImage: UIImage(systemName: "house.fill")
        )
        
        // Following Tab
        let followingVC = FollowingViewController()
        let followingNav = UINavigationController(rootViewController: followingVC)
        followingNav.tabBarItem = UITabBarItem(
            title: "Seguindo",
            image: UIImage(systemName: "heart"),
            selectedImage: UIImage(systemName: "heart.fill")
        )
        
        // Achievements Tab
        let achievementsVC = AchievementsViewController()
        let achievementsNav = UINavigationController(rootViewController: achievementsVC)
        achievementsNav.tabBarItem = UITabBarItem(
            title: "Conquistas",
            image: UIImage(systemName: "trophy"),
            selectedImage: UIImage(systemName: "trophy.fill")
        )
        
        // Settings Tab
        let settingsVC = SettingsViewController()
        let settingsNav = UINavigationController(rootViewController: settingsVC)
        settingsNav.tabBarItem = UITabBarItem(
            title: "Definições",
            image: UIImage(systemName: "gear"),
            selectedImage: UIImage(systemName: "gear")
        )
        
        tabBarController.viewControllers = [homeNav, followingNav, achievementsNav, settingsNav]
        
        window?.rootViewController = tabBarController
        window?.makeKeyAndVisible()
        
        return true
    }
}
