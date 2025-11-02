import UIKit

class FollowingViewController: UIViewController {
    
    private let tableView = UITableView()
    private let emptyLabel = UILabel()
    private var followingAnimals: [AnimalEntity] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupTableView()
        setupConstraints()
        loadFollowingAnimals()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        loadFollowingAnimals()
    }
    
    private func setupUI() {
        title = "Seguindo"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
        
        // Make navigation bar transparent so content scrolls behind
        navigationController?.navigationBar.scrollEdgeAppearance = UINavigationBarAppearance()
        
        emptyLabel.text = "Nenhum animal sendo seguido"
        emptyLabel.textAlignment = .center
        emptyLabel.numberOfLines = 0
        emptyLabel.font = .systemFont(ofSize: 16, weight: .medium)
        emptyLabel.textColor = .secondaryLabel
        emptyLabel.isHidden = true
        emptyLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyLabel)
    }
    
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
    
    private func setupConstraints() {
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            emptyLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            emptyLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])
    }
    
    private func loadFollowingAnimals() {
        followingAnimals = CoreDataManager.shared.fetchFollowingAnimals()
        emptyLabel.isHidden = !followingAnimals.isEmpty
        tableView.reloadData()
    }
}

// MARK: - TableView DataSource
extension FollowingViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return followingAnimals.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withReuseIdentifier: "FollowingCell", for: indexPath) as! FollowingAnimalCell
        let animal = followingAnimals[indexPath.row]
        cell.configure(with: animal)
        cell.delegate = self
        return cell
    }
}

// MARK: - TableView Delegate
extension FollowingViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let animal = followingAnimals[indexPath.row]
        let detailVC = AnimalDetailViewController(animal: animal)
        navigationController?.pushViewController(detailVC, animated: true)
    }
    
    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let animal = followingAnimals[indexPath.row]
        
        let unfollowAction = UIContextualAction(style: .destructive, title: "Deixar de Seguir") { _, _, completionHandler in
            CoreDataManager.shared.toggleFollowing(for: animal)
            self.loadFollowingAnimals()
            completionHandler(true)
        }
        
        let deleteAction = UIContextualAction(style: .destructive, title: "Eliminar") { _, _, completionHandler in
            CoreDataManager.shared.deleteAnimal(animal)
            self.loadFollowingAnimals()
            completionHandler(true)
        }
        
        let configuration = UISwipeActionsConfiguration(actions: [deleteAction, unfollowAction])
        return configuration
    }
}

// MARK: - Following Animal Cell Delegate
extension FollowingViewController: FollowingAnimalCellDelegate {
    func followingAnimalCellDidTapFavorite(_ cell: FollowingAnimalCell, animal: AnimalEntity) {
        CoreDataManager.shared.toggleFollowing(for: animal)
        loadFollowingAnimals()
    }
}

// MARK: - Custom Cell
protocol FollowingAnimalCellDelegate: AnyObject {
    func followingAnimalCellDidTapFavorite(_ cell: FollowingAnimalCell, animal: AnimalEntity)
}

class FollowingAnimalCell: UITableViewCell {
    
    weak var delegate: FollowingAnimalCellDelegate?
    private var animal: AnimalEntity?
    
    private let containerView = UIView()
    private let nameLabel = UILabel()
    private let speciesLabel = UILabel()
    private let breedLabel = UILabel()
    private let savedDateLabel = UILabel()
    private let favoriteImageView = UIImageView()
    private let favoriteButton = UIButton(type: .system)
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI() {
        selectionStyle = .gray
        
        containerView.translatesAutoresizingMaskIntoConstraints = false
        containerView.backgroundColor = .systemGray6
        containerView.layer.cornerRadius = 8
        containerView.clipsToBounds = true
        
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
        
        favoriteImageView.image = UIImage(systemName: "heart.fill")
        favoriteImageView.tintColor = .systemRed
        favoriteImageView.translatesAutoresizingMaskIntoConstraints = false
        
        favoriteButton.translatesAutoresizingMaskIntoConstraints = false
        favoriteButton.addTarget(self, action: #selector(favoriteTapped), for: .touchUpInside)
        
        containerView.addSubview(nameLabel)
        containerView.addSubview(speciesLabel)
        containerView.addSubview(breedLabel)
        containerView.addSubview(savedDateLabel)
        containerView.addSubview(favoriteImageView)
        containerView.addSubview(favoriteButton)
        
        contentView.addSubview(containerView)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 8),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 12),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -12),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8),
            
            favoriteImageView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            favoriteImageView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -12),
            favoriteImageView.widthAnchor.constraint(equalToConstant: 24),
            favoriteImageView.heightAnchor.constraint(equalToConstant: 24),
            
            favoriteButton.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 8),
            favoriteButton.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            favoriteButton.widthAnchor.constraint(equalToConstant: 32),
            favoriteButton.heightAnchor.constraint(equalToConstant: 32),
            
            nameLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            nameLabel.trailingAnchor.constraint(equalTo: favoriteButton.leadingAnchor, constant: -12),
            
            speciesLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            speciesLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            
            breedLabel.topAnchor.constraint(equalTo: speciesLabel.bottomAnchor, constant: 4),
            breedLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            
            savedDateLabel.topAnchor.constraint(equalTo: breedLabel.bottomAnchor, constant: 4),
            savedDateLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            savedDateLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -12)
        ])
    }
    
    @objc private func favoriteTapped() {
        guard let animal = animal else { return }
        delegate?.followingAnimalCellDidTapFavorite(self, animal: animal)
    }
    
    func configure(with animal: AnimalEntity) {
        self.animal = animal
        
        nameLabel.text = animal.name ?? "Sem nome"
        speciesLabel.text = animal.species ?? "-"
        breedLabel.text = "Raça: \(animal.breed ?? "-")"
        
        if let date = animal.savedDate {
            let formatter = DateFormatter()
            formatter.dateStyle = .short
            formatter.timeStyle = .short
            savedDateLabel.text = "Adicionado: \(formatter.string(from: date))"
        }
    }
}
