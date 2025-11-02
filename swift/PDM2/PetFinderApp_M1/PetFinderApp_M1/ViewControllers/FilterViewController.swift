import UIKit

/// Protocolo para comunicar filtros aplicados ao controlador principal
protocol FilterViewControllerDelegate: AnyObject {
    /// Chamado quando os filtros são aplicados
    /// - Parameters:
    ///   - species: Espécie filtrada (opcional)
    ///   - breed: Raça filtrada (opcional)
    ///   - gender: Género filtrado (opcional)
    ///   - age: Idade filtrada (opcional)
    func didApplyFilters(species: String?, breed: String?, gender: String?, age: String?)
}

/// Controlador que permite ao utilizador filtrar a lista de animais
/// Apresentado modalmente sobre a lista principal
class FilterViewController: UIViewController {
    
    // MARK: - Propriedades
    
    /// Delegado para comunicar filtros aplicados
    weak var delegate: FilterViewControllerDelegate?
    
    // MARK: - Elementos de Interface
    
    /// Vista de scroll para permitir navegação vertical
    private let scrollView = UIScrollView()
    
    /// Vista de conteúdo dentro do scroll
    private let contentView = UIView()
    
    /// Botão para aplicar os filtros selecionados
    private let applyButton = UIButton(type: .system)
    
    // MARK: - Ciclo de Vida
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    // MARK: - Configuração da Interface
    
    /// Configura todos os elementos da interface
    private func setupUI() {
        title = "Filtros"
        view.backgroundColor = .systemBackground
        
        // Botão de cancelar na barra de navegação
        navigationItem.leftBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .cancel,
            target: self,
            action: #selector(cancelTapped)
        )
        
        // Configurar ScrollView e ContentView
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        // Configurar botão de aplicar filtros
        applyButton.setTitle("Aplicar Filtros", for: .normal)
        applyButton.backgroundColor = .systemBlue
        applyButton.setTitleColor(.white, for: .normal)
        applyButton.layer.cornerRadius = 8
        applyButton.translatesAutoresizingMaskIntoConstraints = false
        applyButton.addTarget(self, action: #selector(applyTapped), for: .touchUpInside)
        contentView.addSubview(applyButton)
        
        // Configurar restrições de layout
        NSLayoutConstraint.activate([
            // ScrollView ocupa toda a área segura
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            // ContentView dentro do ScrollView
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            // Botão de aplicar
            applyButton.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 32),
            applyButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            applyButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            applyButton.heightAnchor.constraint(equalToConstant: 50),
            applyButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -32)
        ])
    }
    
    // MARK: - Acções
    
    /// Chamado quando o botão de cancelar é pressionado
    /// Fecha o controlador sem aplicar filtros
    @objc private func cancelTapped() {
        dismiss(animated: true)
    }
    
    /// Chamado quando o botão de aplicar é pressionado
    /// Comunica os filtros ao delegado e fecha o controlador
    @objc private func applyTapped() {
        // Por enquanto, aplica filtros vazios (todos os animais)
        delegate?.didApplyFilters(species: nil, breed: nil, gender: nil, age: nil)
        dismiss(animated: true)
    }
}