import UIKit

class AlertHelper {
    
    static func showAlert(
        on vc: UIViewController,
        title: String,
        message: String,
        completion: (() -> Void)? = nil
    ) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            completion?()
        })
        vc.present(alert, animated: true)
    }
    
    static func showError(on vc: UIViewController, error: Error) {
        showAlert(on: vc, title: "Erro", message: error.localizedDescription)
    }
    
    static func showSuccess(
        on vc: UIViewController,
        message: String,
        completion: (() -> Void)? = nil
    ) {
        showAlert(on: vc, title: "Sucesso", message: message, completion: completion)
    }
    
    static func showConfirmation(
        on vc: UIViewController,
        title: String,
        message: String,
        confirmTitle: String = "Confirmar",
        confirmStyle: UIAlertAction.Style = .default,
        onConfirm: @escaping () -> Void
    ) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        alert.addAction(UIAlertAction(title: confirmTitle, style: confirmStyle) { _ in
            onConfirm()
        })
        vc.present(alert, animated: true)
    }
}
