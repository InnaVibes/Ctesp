import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Incrementar contador de lançamentos
        AchievementsManager.shared.incrementAppLaunchCount()
        
        // Configurar a janela principal
        window = UIWindow(frame: UIScreen.main.bounds)
        
        // Criar um ViewController temporário
        let viewController = UIViewController()
        viewController.view.backgroundColor = .systemBackground
        
        let label = UILabel()
        label.text = "PetFinder App"
        label.font = .systemFont(ofSize: 24, weight: .bold)
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        viewController.view.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: viewController.view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: viewController.view.centerYAnchor)
        ])
        
        window?.rootViewController = viewController
        window?.makeKeyAndVisible()
        
        return true
    }
}
