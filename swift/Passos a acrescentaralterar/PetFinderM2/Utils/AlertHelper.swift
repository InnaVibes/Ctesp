import UIKit

/// Utilitário para exibir alertas de forma simplificada
class AlertHelper {
    
    /// Mostra um alerta simples com título e mensagem
    /// - Parameters:
    ///   - viewController: ViewController que apresentará o alerta
    ///   - title: Título do alerta
    ///   - message: Mensagem do alerta
    ///   - completion: Closure chamada quando o alerta é fechado (opcional)
    static func showAlert(
        on viewController: UIViewController,
        title: String,
        message: String,
        completion: (() -> Void)? = nil
    ) {
        let alert = UIAlertController(
            title: title,
            message: message,
            preferredStyle: .alert
        )
        
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            completion?()
        })
        
        viewController.present(alert, animated: true)
    }
    
    /// Mostra um alerta de erro
    /// - Parameters:
    ///   - viewController: ViewController que apresentará o alerta
    ///   - error: Erro a ser exibido
    static func showError(
        on viewController: UIViewController,
        error: Error
    ) {
        showAlert(
            on: viewController,
            title: "Erro",
            message: error.localizedDescription
        )
    }
    
    /// Mostra um alerta de sucesso
    /// - Parameters:
    ///   - viewController: ViewController que apresentará o alerta
    ///   - message: Mensagem de sucesso
    ///   - completion: Closure chamada quando o alerta é fechado (opcional)
    static func showSuccess(
        on viewController: UIViewController,
        message: String,
        completion: (() -> Void)? = nil
    ) {
        showAlert(
            on: viewController,
            title: "Sucesso",
            message: message,
            completion: completion
        )
    }
    
    /// Mostra um alerta de confirmação com duas opções
    /// - Parameters:
    ///   - viewController: ViewController que apresentará o alerta
    ///   - title: Título do alerta
    ///   - message: Mensagem do alerta
    ///   - confirmTitle: Título do botão de confirmação
    ///   - confirmStyle: Estilo do botão de confirmação
    ///   - onConfirm: Closure chamada quando confirmar
    static func showConfirmation(
        on viewController: UIViewController,
        title: String,
        message: String,
        confirmTitle: String = "Confirmar",
        confirmStyle: UIAlertAction.Style = .default,
        onConfirm: @escaping () -> Void
    ) {
        let alert = UIAlertController(
            title: title,
            message: message,
            preferredStyle: .alert
        )
        
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        alert.addAction(UIAlertAction(title: confirmTitle, style: confirmStyle) { _ in
            onConfirm()
        })
        
        viewController.present(alert, animated: true)
    }
    
    /// Mostra um alerta com campo de texto
    /// - Parameters:
    ///   - viewController: ViewController que apresentará o alerta
    ///   - title: Título do alerta
    ///   - message: Mensagem do alerta
    ///   - placeholder: Placeholder do campo de texto
    ///   - currentValue: Valor atual do campo (opcional)
    ///   - keyboardType: Tipo de teclado
    ///   - onSave: Closure chamada com o texto inserido
    static func showTextInput(
        on viewController: UIViewController,
        title: String,
        message: String,
        placeholder: String,
        currentValue: String? = nil,
        keyboardType: UIKeyboardType = .default,
        onSave: @escaping (String) -> Void
    ) {
        let alert = UIAlertController(
            title: title,
            message: message,
            preferredStyle: .alert
        )
        
        alert.addTextField { textField in
            textField.placeholder = placeholder
            textField.text = currentValue
            textField.keyboardType = keyboardType
        }
        
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        alert.addAction(UIAlertAction(title: "Guardar", style: .default) { _ in
            if let text = alert.textFields?.first?.text, !text.isEmpty {
                onSave(text)
            }
        })
        
        viewController.present(alert, animated: true)
    }
}
