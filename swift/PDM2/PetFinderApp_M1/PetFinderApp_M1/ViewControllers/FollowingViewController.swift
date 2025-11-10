import UIKit

/// Controlador que apresenta a lista de animais que o utilizador está a seguir
/// Permite visualizar e gerir os animais favoritos
class FollowingViewController: UIViewController {
    
    // MARK: - Propriedades de Interface
    
    /// Tabela que exibe os animais seguidos
    private let tableView = UITableView()
    
    /// Etiqueta mostrada quando não há animais a seguir
    private let emptyLabel = UILabel()
    
    // MARK: - Propriedades de Dados
    
    /// Array com os animais que o utilizador está a seguir
    private var followingAnimals: [AnimalEntity] = []
    
    // MARK: - Ciclo de Vida
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupTableView()
        setupConstraints()
        loadFollowingAnimals()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // Recarregar sempre que a vista aparecer
        loadFollowingAnimals()
    }
    
    // MARK: - Configuração da Interface
    
    /// Configura os elementos básicos da interface
    private func setupUI() {
        title = "Seguindo"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
        
        // Barra de navegação transparente para scroll
        navigationController?.navigationBar.scrollEdgeAppearance = UINavigationBarAppearance()
        
        // Configurar etiqueta de estado vazio
        emptyLabel.text = "Nenhum animal sendo seguido"
        emptyLabel.textAlignment = .center
        emptyLabel.numberOfLines = 0
        emptyLabel.font = .systemFont(ofSize: 16, weight: .medium)
        emptyLabel.textColor = .secondaryLabel
        emptyLabel.isHidden = true
        emptyLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyLabel)
    }
    
    /// Configura a tabela de animais seguidos
    private func setupTableView() {
        tableView.translatesAutoresizingMaskIntoConstraints = false
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(FollowingAnimalCell.self, forCellReuseIdentifier: "FollowingCell")
        tableView.rowHeight = UITableView.automaticDimension
        tableView.estimatedRowHeight = 100
        tableView.separatorStyle = .singleLine
        
        view.addSubview(tableView)
    }
    
    /// Configura as restrições de layout
    private func setupConstraints() {
        NSLayoutConstraint.activate([
            // Tabela ocupa toda a área
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            
            // Etiqueta vazia centrada
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            emptyLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            emptyLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])
    }
    
    // MARK: - Gestão de Dados
    
    /// Carrega os animais seguidos da base de dados
    private func loadFollowingAnimals() {
        followingAnimals = CoreDataManager.shared.fetchFollowingAnimals()
        emptyLabel.isHidden = !followingAnimals.isEmpty
        tableView.reloadData()
    }
}

// MARK: - Data Source da Tabela

extension FollowingViewController: UITableViewDataSource {
    
    /// Número de linhas na tabela
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return followingAnimals.count
    }
    
    /// Configura cada célula com os dados de um animal seguido
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FollowingCell", for: indexPath) as! FollowingAnimalCell
        let animal = followingAnimals[indexPath.row]
        cell.configure(with: animal)
        cell.delegate = self
        return cell
    }
}

// MARK: - Delegate da Tabela

extension FollowingViewController: UITableViewDelegate {
    
    /// Navega para os detalhes quando uma linha é selecionada
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let animal = followingAnimals[indexPath.row]
        let detailVC = AnimalDetailViewController(animal: animal)
        navigationController?.pushViewController(detailVC, animated: true)
    }
    
    /// Configura acções de swipe (deixar de seguir e eliminar)
    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let animal = followingAnimals[indexPath.row]
        
        // Acção para deixar de seguir
        let unfollowAction = UIContextualAction(
            style: .destructive,
            title: "Deixar de Seguir"
        ) { _, _, completionHandler in
            CoreDataManager.shared.toggleFollowing(for: animal)
            self.loadFollowingAnimals()
            completionHandler(true)
        }
        
        // Acção para eliminar completamente
        let deleteAction = UIContextualAction(
            style: .destructive,
            title: "Eliminar"
        ) { _, _, completionHandler in
            CoreDataManager.shared.deleteAnimal(animal)
            self.loadFollowingAnimals()
            completionHandler(true)
        }
        
        let configuration = UISwipeActionsConfiguration(actions: [deleteAction, unfollowAction])
        return configuration
    }
}

// MARK: - Delegate da Célula

extension FollowingViewController: FollowingAnimalCellDelegate {
    
    /// Chamado quando o botão de favorito é pressionado
    func followingAnimalCellDidTapFavorite(_ cell: FollowingAnimalCell, animal: AnimalEntity) {
        CoreDataManager.shared.toggleFollowing(for: animal)
        loadFollowingAnimals()
    }
}

// MARK: - Protocolo de Delegado da Célula

/// Protocolo para comunicar acções da célula de animal seguido
protocol FollowingAnimalCellDelegate: AnyObject {
    /// Chamado quando o botão de favorito é pressionado
    func followingAnimalCellDidTapFavorite(_ cell: FollowingAnimalCell, animal: AnimalEntity)
}

// MARK: - Célula Personalizada

/// Célula personalizada para exibir animais seguidos
class FollowingAnimalCell: UITableViewCell {
    
    // MARK: - Propriedades
    
    /// Delegado para comunicar acções
    weak var delegate: FollowingAnimalCellDelegate?
    
    /// Animal exibido nesta célula
    private var animal: AnimalEntity?
    
    // MARK: - Elementos de Interface
    
    /// Vista contentor com fundo colorido
    private let containerView = UIView()
    
    /// Nome do animal
    private let nameLabel = UILabel()
    
    /// Espécie do animal
    private let speciesLabel = UILabel()
    
    /// Raça do animal
    private let breedLabel = UILabel()
    
    /// Data em que foi adicionado
    private let savedDateLabel = UILabel()
    
    /// Ícone de coração preenchido
    private let favoriteImageView = UIImageView()
    
    /// Botão invisível sobre o ícone para detetar toques
    private let favoriteButton = UIButton(type: .system)
    
    // MARK: - Inicialização
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) não foi implementado")
    }
    
    // MARK: - Configuração da Interface
    
    /// Configura todos os elementos visuais da célula
    private func setupUI() {
        selectionStyle = .gray
        
        // Vista contentor
        containerView.translatesAutoresizingMaskIntoConstraints = false
        containerView.backgroundColor = .systemGray6
        containerView.layer.cornerRadius = 8
        containerView.clipsToBounds = true
        
        // Etiquetas
        nameLabel.font = .systemFont(ofSize: 16, weight: .bold)
        nameLabel.textColor = .label
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        
        speciesLabel.font = .systemFont(ofSize: 13, weight: .semibold)
        speciesLabel.textColor = .systemBlue
        speciesLabel.translatesAutoresizingMaskIntoConstraints = false
        
        breedLabel.font = .systemFont(ofSize: 12, weight: .regular)
        breedLabel.textColor = .secondaryLabel
        breedLabel.translatesAutoresizingMaskIntoConstraints = false
        
        savedDateLabel.font = .systemFont(ofSize: 11, weight: .light)
        savedDateLabel.textColor = .tertiaryLabel
        savedDateLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Ícone de favorito
        favoriteImageView.image = UIImage(systemName: "heart.fill")
        favoriteImageView.tintColor = .systemRed
        favoriteImageView.translatesAutoresizingMaskIntoConstraints = false
        
        // Botão de favorito (invisível)
        favoriteButton.translatesAutoresizingMaskIntoConstraints = false
        favoriteButton.addTarget(self, action: #selector(favoriteTapped), for: .touchUpInside)
        
        // Adicionar elementos
        containerView.addSubview(nameLabel)
        containerView.addSubview(speciesLabel)
        containerView.addSubview(breedLabel)
        containerView.addSubview(savedDateLabel)
        containerView.addSubview(favoriteImageView)
        containerView.addSubview(favoriteButton)
        
        contentView.addSubview(containerView)
        
        // Restrições de layout
        NSLayoutConstraint.activate([
            // Vista contentor
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 8),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 12),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -12),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8),
            
            // Ícone de favorito no canto superior direito
            favoriteImageView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            favoriteImageView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -12),
            favoriteImageView.widthAnchor.constraint(equalToConstant: 24),
            favoriteImageView.heightAnchor.constraint(equalToConstant: 24),
            
            // Botão sobre o ícone
            favoriteButton.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 8),
            favoriteButton.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            favoriteButton.widthAnchor.constraint(equalToConstant: 32),
            favoriteButton.heightAnchor.constraint(equalToConstant: 32),
            
            // Nome no topo à esquerda
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            nameLabel.trailingAnchor.constraint(equalTo: favoriteButton.leadingAnchor, constant: -12),
            
            // Espécie abaixo do nome
            speciesLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            speciesLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            
            // Raça abaixo da espécie
            breedLabel.topAnchor.constraint(equalTo: speciesLabel.bottomAnchor, constant: 4),
            breedLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            
            // Data no fundo
            savedDateLabel.topAnchor.constraint(equalTo: breedLabel.bottomAnchor, constant: 4),
            savedDateLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            savedDateLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12)
        ])
    }
    
    // MARK: - Acções
    
    /// Chamado quando o botão de favorito é pressionado
    @objc private func favoriteTapped() {
        guard let animal = animal else { return }
        delegate?.followingAnimalCellDidTapFavorite(self, animal: animal)
    }
    
    // MARK: - Configuração
    
    /// Configura a célula com os dados de um animal
    /// - Parameter animal: Animal a ser exibido
    func configure(with animal: AnimalEntity) {
        self.animal = animal
        
        nameLabel.text = animal.name ?? "Sem nome"
        speciesLabel.text = animal.species ?? "-"
        breedLabel.text = "Raça: \(animal.breed ?? "-")"
        
        // Formatar data de quando foi adicionado
        if let date = animal.savedDate {
            let formatter = DateFormatter()
            formatter.dateStyle = .short
            formatter.timeStyle = .short
            savedDateLabel.text = "Adicionado: \(formatter.string(from: date))"
        }
    }
}