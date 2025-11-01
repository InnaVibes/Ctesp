import UIKit

class AnimalListViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Animais para Adoção"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
    }
}
