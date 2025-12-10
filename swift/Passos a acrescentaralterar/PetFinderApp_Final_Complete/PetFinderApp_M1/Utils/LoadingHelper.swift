import UIKit

class LoadingHelper {
    
    private static var loadingAlert: UIAlertController?
    
    static func show(on vc: UIViewController, message: String = "Carregando...") {
        hide()
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        let indicator = UIActivityIndicatorView(style: .large)
        indicator.translatesAutoresizingMaskIntoConstraints = false
        indicator.startAnimating()
        alert.view.addSubview(indicator)
        NSLayoutConstraint.activate([
            indicator.centerXAnchor.constraint(equalTo: alert.view.centerXAnchor),
            indicator.bottomAnchor.constraint(equalTo: alert.view.bottomAnchor, constant: -20)
        ])
        loadingAlert = alert
        vc.present(alert, animated: true)
    }
    
    static func hide(completion: (() -> Void)? = nil) {
        loadingAlert?.dismiss(animated: true) {
            loadingAlert = nil
            completion?()
        }
    }
}
