import UIKit

/// Controlador que apresenta os detalhes completos de um animal
/// Permite visualizar todas as informações e realizar acções como partilhar e contactar
class AnimalDetailViewController: UIViewController {
    
    // MARK: - Propriedades
    
    /// Animal a ser exibido
    private let animal: AnimalEntity
    
    // MARK: - Elementos de Interface - Scroll
    
    /// Vista de scroll para permitir navegação vertical
    private let scrollView = UIScrollView()
    
    /// Vista de conteúdo dentro do scroll
    private let contentView = UIView()
    
    // MARK: - Elementos de Interface - Cabeçalho
    
    /// Vista para a fotografia do animal (placeholder)
    private let photoView = UIView()
    
    /// Etiqueta com o nome do animal
    private let nameLabel = UILabel()
    
    /// Botão para adicionar/remover dos favoritos
    private let favoriteButton = UIButton(type: .system)
    
    // MARK: - Elementos de Interface - Informações
    
    /// Etiqueta com a espécie
    private let speciesLabel = UILabel()
    
    /// Etiqueta com a raça
    private let breedLabel = UILabel()
    
    /// Etiqueta com o género
    private let genderLabel = UILabel()
    
    /// Etiqueta com a idade
    private let ageLabel = UILabel()
    
    /// Etiqueta com a localização
    private let locationLabel = UILabel()
    
    // MARK: - Elementos de Interface - Descrição
    
    /// Título da secção de descrição
    private let descriptionTitleLabel = UILabel()
    
    /// Etiqueta com a descrição completa do animal
    private let descriptionLabel = UILabel()
    
    // MARK: - Elementos de Interface - Botões de Acção
    
    /// Botão para partilhar informações do animal
    private let shareButton = UIButton(type: .system)
    
    /// Botão para contactar sobre o animal
    private let contactButton = UIButton(type: .system)
    
    // MARK: - Inicialização
    
    /// Inicializa o controlador com um animal específico
    /// - Parameter animal: Animal a ser exibido
    init(animal: AnimalEntity) {
        self.animal = animal
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) não foi implementado")
    }
    
    // MARK: - Ciclo de Vida
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupConstraints()
        updateUI()
    }
    
    // MARK: - Configuração da Interface
    
    /// Configura todos os elementos visuais
    private func setupUI() {
        view.backgroundColor = .systemBackground
        navigationItem.largeTitleDisplayMode = .never
        
        // Configurar ScrollView e ContentView
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        // Configurar vista de fotografia (placeholder)
        photoView.backgroundColor = .systemGray5
        photoView.layer.cornerRadius = 12
        photoView.clipsToBounds = true
        photoView.translatesAutoresizingMaskIntoConstraints = false
        
        let photoLabel = UILabel()
        photoLabel.text = "📷"
        photoLabel.font = UIFont.systemFont(ofSize: 60)
        photoLabel.textAlignment = .center
        photoLabel.translatesAutoresizingMaskIntoConstraints = false
        photoView.addSubview(photoLabel)
        
        NSLayoutConstraint.activate([
            photoLabel.centerXAnchor.constraint(equalTo: photoView.centerXAnchor),
            photoLabel.centerYAnchor.constraint(equalTo: photoView.centerYAnchor)
        ])
        
        contentView.addSubview(photoView)
        
        // Configurar etiqueta de nome
        nameLabel.font = .systemFont(ofSize: 28, weight: .bold)
        nameLabel.textColor = .label
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(nameLabel)
        
        // Configurar botão de favorito
        favoriteButton.setImage(UIImage(systemName: "heart"), for: .normal)
        favoriteButton.setImage(UIImage(systemName: "heart.fill"), for: .selected)
        favoriteButton.translatesAutoresizingMaskIntoConstraints = false
        favoriteButton.addTarget(self, action: #selector(favoriteTapped), for: .touchUpInside)
        contentView.addSubview(favoriteButton)
        
        // Configurar stack de informações
        let infoStackView = UIStackView()
        infoStackView.axis = .vertical
        infoStackView.spacing = 12
        infoStackView.translatesAutoresizingMaskIntoConstraints = false
        
        // Configurar etiquetas de informação
        configureInfoLabel(speciesLabel)
        configureInfoLabel(breedLabel)
        configureInfoLabel(genderLabel)
        configureInfoLabel(ageLabel)
        configureInfoLabel(locationLabel)
        
        infoStackView.addArrangedSubview(speciesLabel)
        infoStackView.addArrangedSubview(breedLabel)
        infoStackView.addArrangedSubview(genderLabel)
        infoStackView.addArrangedSubview(ageLabel)
        infoStackView.addArrangedSubview(locationLabel)
        
        contentView.addSubview(infoStackView)
        
        // Configurar secção de descrição
        descriptionTitleLabel.text = "Sobre"
        descriptionTitleLabel.font = .systemFont(ofSize: 18, weight: .bold)
        descriptionTitleLabel.textColor = .label
        descriptionTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(descriptionTitleLabel)
        
        descriptionLabel.font = .systemFont(ofSize: 14, weight: .regular)
        descriptionLabel.textColor = .secondaryLabel
        descriptionLabel.numberOfLines = 0
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(descriptionLabel)
        
        // Configurar botões de acção
        configureActionButton(shareButton, title: "Partilhar", color: .systemBlue, action: #selector(shareTapped))
        configureActionButton(contactButton, title: "Contactar", color: .systemGreen, action: #selector(contactTapped))
        
        contentView.addSubview(shareButton)
        contentView.addSubview(contactButton)
    }
    
    /// Configura uma etiqueta de informação
    /// - Parameter label: Etiqueta a configurar
    private func configureInfoLabel(_ label: UILabel) {
        label.font = .systemFont(ofSize: 14, weight: .semibold)
        label.textColor = .secondaryLabel
        label.translatesAutoresizingMaskIntoConstraints = false
    }
    
    /// Configura um botão de acção
    /// - Parameters:
    ///   - button: Botão a configurar
    ///   - title: Título do botão
    ///   - color: Cor de fundo
    ///   - action: Selector da acção
    private func configureActionButton(_ button: UIButton, title: String, color: UIColor, action: Selector) {
        button.setTitle(title, for: .normal)
        button.backgroundColor = color
        button.setTitleColor(.white, for: .normal)
        button.layer.cornerRadius = 8
        button.translatesAutoresizingMaskIntoConstraints = false
        button.addTarget(self, action: action, for: .touchUpInside)
    }
    
    /// Configura todas as restrições de layout
    private func setupConstraints() {
        NSLayoutConstraint.activate([
            // ScrollView ocupa toda a área
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
            
            // Vista de fotografia
            photoView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
            photoView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            photoView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            photoView.heightAnchor.constraint(equalToConstant: 200),
            
            // Nome e botão de favorito
            nameLabel.topAnchor.constraint(equalTo: photoView.bottomAnchor, constant: 20),
            nameLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            nameLabel.trailingAnchor.constraint(equalTo: favoriteButton.leadingAnchor, constant: -12),
            
            favoriteButton.centerYAnchor.constraint(equalTo: nameLabel.centerYAnchor),
            favoriteButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            favoriteButton.widthAnchor.constraint(equalToConstant: 44),
            favoriteButton.heightAnchor.constraint(equalToConstant: 44),
            
            // Informações
            speciesLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 16),
            speciesLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            speciesLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            breedLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            breedLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            genderLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            genderLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            ageLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            ageLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            locationLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            locationLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            // Descrição
            descriptionTitleLabel.topAnchor.constraint(equalTo: locationLabel.bottomAnchor, constant: 24),
            descriptionTitleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            descriptionTitleLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            descriptionLabel.topAnchor.constraint(equalTo: descriptionTitleLabel.bottomAnchor, constant: 8),
            descriptionLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            descriptionLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            // Botões de acção
            shareButton.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 24),
            shareButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            shareButton.trailingAnchor.constraint(equalTo: contentView.centerXAnchor, constant: -6),
            shareButton.heightAnchor.constraint(equalToConstant: 50),
            
            contactButton.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 24),
            contactButton.leadingAnchor.constraint(equalTo: contentView.centerXAnchor, constant: 6),
            contactButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            contactButton.heightAnchor.constraint(equalToConstant: 50),
            contactButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20)
        ])
    }
    
    // MARK: - Actualização de Interface
    
    /// Actualiza todos os elementos da interface com os dados do animal
    private func updateUI() {
        title = animal.name ?? "Animal"
        nameLabel.text = animal.name ?? "Sem nome"
        
        speciesLabel.text = "🐾 Espécie: \(animal.species ?? "-")"
        breedLabel.text = "🏷️ Raça: \(animal.breed ?? "-")"
        genderLabel.text = "👥 Género: \(animal.gender ?? "-")"
        ageLabel.text = "📅 Idade: \(animal.age ?? "-")"
        locationLabel.text = "📍 Localização: \(animal.location ?? "-")"
        
        descriptionLabel.text = animal.descriptionText ?? "Sem informações disponíveis"
        
        favoriteButton.isSelected = animal.isFollowing
        favoriteButton.tintColor = animal.isFollowing ? .systemRed : .systemGray
    }
    
    // MARK: - Acções
    
    /// Alterna o estado de favorito do animal
    @objc private func favoriteTapped() {
        CoreDataManager.shared.toggleFollowing(for: animal)
        updateUI()
    }
    
    /// Partilha informações do animal através do sistema
    @objc private func shareTapped() {
        let text = "Conheça o \(animal.name ?? "animal")! \(animal.descriptionText ?? "") - Localização: \(animal.location ?? "-")"
        let activityVC = UIActivityViewController(activityItems: [text], applicationActivities: nil)
        present(activityVC, animated: true)
    }
    
    /// Apresenta opção de contacto (funcionalidade em desenvolvimento)
    @objc private func contactTapped() {
        let alert = UIAlertController(
            title: "Contactar",
            message: "Em desenvolvimento. Será possível contactar diretamente pela app em breve.",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}