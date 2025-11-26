import UIKit

/// Utilitário para exibir indicadores de carregamento
class LoadingHelper {
    
    // MARK: - Propriedades
    
    /// Alerta de loading atualmente exibido
    private static var loadingAlert: UIAlertController?
    
    // MARK: - Métodos Públicos
    
    /// Mostra um indicador de carregamento
    /// - Parameters:
    ///   - viewController: ViewController que apresentará o loading
    ///   - message: Mensagem a exibir
    static func show(
        on viewController: UIViewController,
        message: String = "Carregando..."
    ) {
        // Remover loading anterior se existir
        hide()
        
        let alert = UIAlertController(
            title: nil,
            message: message,
            preferredStyle: .alert
        )
        
        let loadingIndicator = UIActivityIndicatorView(style: .large)
        loadingIndicator.translatesAutoresizingMaskIntoConstraints = false
        loadingIndicator.startAnimating()
        
        alert.view.addSubview(loadingIndicator)
        
        NSLayoutConstraint.activate([
            loadingIndicator.centerXAnchor.constraint(equalTo: alert.view.centerXAnchor),
            loadingIndicator.bottomAnchor.constraint(equalTo: alert.view.bottomAnchor, constant: -20)
        ])
        
        loadingAlert = alert
        viewController.present(alert, animated: true)
    }
    
    /// Esconde o indicador de carregamento
    /// - Parameter completion: Closure chamada após fechar
    static func hide(completion: (() -> Void)? = nil) {
        loadingAlert?.dismiss(animated: true) {
            loadingAlert = nil
            completion?()
        }
    }
}
