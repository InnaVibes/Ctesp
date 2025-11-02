import UIKit

/// Controlador que apresenta as conquistas do utilizador
/// Exibe conquistas desbloqueadas e bloqueadas num formato de grelha
class AchievementsViewController: UIViewController {
    
    // MARK: - Propriedades de Interface
    
    /// Vista de coleção para exibir conquistas em grelha
    private let collectionView: UICollectionView = {
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .vertical
        layout.minimumLineSpacing = 16
        layout.minimumInteritemSpacing = 16
        layout.sectionInset = UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16)
        
        // Calcular tamanho dos itens (2 por linha)
        let itemWidth = (UIScreen.main.bounds.width - 16 * 3) / 2
        layout.itemSize = CGSize(width: itemWidth, height: itemWidth)
        
        return UICollectionView(frame: .zero, collectionViewLayout: layout)
    }()
    
    /// Etiqueta mostrada quando não há conquistas
    private let emptyLabel = UILabel()
    
    // MARK: - Propriedades de Dados
    
    /// Lista de todas as conquistas disponíveis
    let achievements: [Achievement] = [
        Achievement(
            id: 1,
            title: "Primeiro Passo",
            description: "Seguir seu primeiro animal",
            icon: "star.fill",
            isUnlocked: true
        ),
        Achievement(
            id: 2,
            title: "Colecionador",
            description: "Seguir 5 animais",
            icon: "heart.circle.fill",
            isUnlocked: true
        ),
        Achievement(
            id: 3,
            title: "Protetor",
            description: "Seguir 10 animais",
            icon: "shield.fill",
            isUnlocked: false
        ),
        Achievement(
            id: 4,
            title: "Campeão",
            description: "Seguir 25 animais",
            icon: "crown.fill",
            isUnlocked: false
        ),
        Achievement(
            id: 5,
            title: "Visitante",
            description: "Visitar a app 5 vezes",
            icon: "eye.fill",
            isUnlocked: true
        ),
        Achievement(
            id: 6,
            title: "Explorador",
            description: "Visitar a app 20 vezes",
            icon: "map.fill",
            isUnlocked: false
        ),
    ]
    
    // MARK: - Ciclo de Vida
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupCollectionView()
        setupConstraints()
    }
    
    // MARK: - Configuração da Interface
    
    /// Configura os elementos básicos da interface
    private func setupUI() {
        title = "Conquistas"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
        
        // Configurar etiqueta de estado vazio
        emptyLabel.text = "Desbloqueie conquistas\nseguindo animais!"
        emptyLabel.textAlignment = .center
        emptyLabel.numberOfLines = 0
        emptyLabel.font = .systemFont(ofSize: 16, weight: .medium)
        emptyLabel.textColor = .secondaryLabel
        emptyLabel.isHidden = true
        emptyLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyLabel)
    }
    
    /// Configura a vista de coleção
    private func setupCollectionView() {
        collectionView.translatesAutoresizingMaskIntoConstraints = false
        collectionView.dataSource = self
        collectionView.delegate = self
        collectionView.backgroundColor = .systemBackground
        collectionView.register(AchievementCell.self, forCellWithReuseIdentifier: "AchievementCell")
        
        view.addSubview(collectionView)
    }
    
    /// Configura as restrições de layout
    private func setupConstraints() {
        NSLayoutConstraint.activate([
            // Vista de coleção ocupa toda a área
            collectionView.topAnchor.constraint(equalTo: view.topAnchor),
            collectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            collectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            collectionView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            
            // Etiqueta vazia centrada
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            emptyLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            emptyLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])
    }
}

// MARK: - Data Source da Vista de Coleção

extension AchievementsViewController: UICollectionViewDataSource {
    
    /// Número de conquistas a exibir
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return achievements.count
    }
    
    /// Configura cada célula com dados de uma conquista
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "AchievementCell", for: indexPath) as! AchievementCell
        let achievement = achievements[indexPath.row]
        cell.configure(with: achievement)
        return cell
    }
}

// MARK: - Delegate da Vista de Coleção

extension AchievementsViewController: UICollectionViewDelegate {
    
    /// Mostra detalhes quando uma conquista é selecionada
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let achievement = achievements[indexPath.row]
        showAchievementDetails(achievement)
    }
    
    /// Apresenta um alerta com detalhes da conquista
    /// - Parameter achievement: Conquista a exibir
    private func showAchievementDetails(_ achievement: Achievement) {
        let alert = UIAlertController(
            title: achievement.title,
            message: achievement.description,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(
            title: achievement.isUnlocked ? "Conseguido!" : "Bloqueado",
            style: .default
        ))
        present(alert, animated: true)
    }
}

// MARK: - Modelo de Conquista

/// Estrutura que representa uma conquista
struct Achievement {
    /// Identificador único
    let id: Int
    
    /// Título da conquista
    let title: String
    
    /// Descrição de como desbloquear
    let description: String
    
    /// Nome do ícone SF Symbol
    let icon: String
    
    /// Se a conquista está desbloqueada
    let isUnlocked: Bool
}

// MARK: - Célula de Conquista

/// Célula personalizada para exibir uma conquista
class AchievementCell: UICollectionViewCell {
    
    // MARK: - Elementos de Interface
    
    /// Vista contentor com fundo
    private let containerView = UIView()
    
    /// Ícone da conquista
    private let iconView = UIImageView()
    
    /// Título da conquista
    private let titleLabel = UILabel()
    
    /// Descrição da conquista
    private let descriptionLabel = UILabel()
    
    /// Ícone de cadeado para conquistas bloqueadas
    private let lockImageView = UIImageView()
    
    // MARK: - Inicialização
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) não foi implementado")
    }
    
    // MARK: - Configuração da Interface
    
    /// Configura todos os elementos visuais da célula
    private func setupUI() {
        // Vista contentor
        containerView.translatesAutoresizingMaskIntoConstraints = false
        containerView.backgroundColor = .systemGray6
        containerView.layer.cornerRadius = 12
        containerView.clipsToBounds = true
        containerView.layer.borderWidth = 2
        containerView.layer.borderColor = UIColor.clear.cgColor
        
        // Ícone da conquista
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        
        // Título
        titleLabel.font = .systemFont(ofSize: 14, weight: .bold)
        titleLabel.textColor = .label
        titleLabel.textAlignment = .center
        titleLabel.numberOfLines = 1
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Descrição
        descriptionLabel.font = .systemFont(ofSize: 11, weight: .regular)
        descriptionLabel.textColor = .secondaryLabel
        descriptionLabel.textAlignment = .center
        descriptionLabel.numberOfLines = 2
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Ícone de cadeado
        lockImageView.image = UIImage(systemName: "lock.fill")
        lockImageView.tintColor = .systemGray
        lockImageView.translatesAutoresizingMaskIntoConstraints = false
        
        // Adicionar elementos
        containerView.addSubview(iconView)
        containerView.addSubview(titleLabel)
        containerView.addSubview(descriptionLabel)
        containerView.addSubview(lockImageView)
        contentView.addSubview(containerView)
        
        // Restrições de layout
        NSLayoutConstraint.activate([
            // Vista contentor preenche toda a célula
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor),
            
            // Ícone no topo, centrado
            iconView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            iconView.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
            iconView.widthAnchor.constraint(equalToConstant: 50),
            iconView.heightAnchor.constraint(equalToConstant: 50),
            
            // Título abaixo do ícone
            titleLabel.topAnchor.constraint(equalTo: iconView.bottomAnchor, constant: 8),
            titleLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 8),
            titleLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            
            // Descrição abaixo do título
            descriptionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            descriptionLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 8),
            descriptionLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            descriptionLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -8),
            
            // Cadeado no canto superior direito
            lockImageView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 8),
            lockImageView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            lockImageView.widthAnchor.constraint(equalToConstant: 20),
            lockImageView.heightAnchor.constraint(equalToConstant: 20)
        ])
    }
    
    // MARK: - Configuração
    
    /// Configura a célula com dados de uma conquista
    /// - Parameter achievement: Conquista a exibir
    func configure(with achievement: Achievement) {
        // Configurar ícone
        iconView.image = UIImage(systemName: achievement.icon)
        iconView.tintColor = achievement.isUnlocked ? .systemYellow : .systemGray3
        
        // Configurar textos
        titleLabel.text = achievement.title
        descriptionLabel.text = achievement.description
        
        // Mostrar/ocultar cadeado
        lockImageView.isHidden = achievement.isUnlocked
        
        // Ajustar aparência conforme estado
        containerView.backgroundColor = achievement.isUnlocked ? .systemGray6 : .systemGray5
        containerView.layer.borderColor = achievement.isUnlocked ? UIColor.systemYellow.cgColor : UIColor.clear.cgColor
        
        // Opacidade reduzida para conquistas bloqueadas
        alpha = achievement.isUnlocked ? 1.0 : 0.6
    }
}