import UIKit

class AnimalListViewController: UIViewController {
    
    private let tableView = UITableView()
    private let emptyLabel = UILabel()
    private var animals: [AnimalEntity] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupTableView()
        setupConstraints()
        loadAnimals()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        loadAnimals()
    }
    
    private func setupUI() {
        title = "Animais para Adoção"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
        
        // Add Filter Button
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            image: UIImage(systemName: "slider.horizontal.3"),
            style: .plain,
            target: self,
            action: #selector(filterTapped)
        )
        
        // Empty state label
        emptyLabel.text = "Nenhum animal encontrado\n\nToque para recarregar"
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
        tableView.register(AnimalTableViewCell.self, forCellReuseIdentifier: "AnimalCell")
        tableView.rowHeight = UITableView.automaticDimension
        tableView.estimatedRowHeight = 120
        tableView.separatorStyle = .singleLine
        
        view.addSubview(tableView)
    }
    
    private func setupConstraints() {
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            emptyLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            emptyLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])
    }
    
    private func loadAnimals() {
        animals = CoreDataManager.shared.fetchAllAnimals()
        emptyLabel.isHidden = !animals.isEmpty
        tableView.reloadData()
    }
    
    @objc private func filterTapped() {
        let filterVC = FilterViewController()
        filterVC.delegate = self
        let nav = UINavigationController(rootViewController: filterVC)
        present(nav, animated: true)
    }
}

// MARK: - TableView DataSource
extension AnimalListViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return animals.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AnimalCell", for: indexPath) as! AnimalTableViewCell
        let animal = animals[indexPath.row]
        cell.configure(with: animal)
        return cell
    }
}

// MARK: - TableView Delegate
extension AnimalListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let animal = animals[indexPath.row]
        print("Selecionado: \(animal.name ?? "Sem nome")")
    }
    
    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let animal = animals[indexPath.row]
        
        let followAction = UIContextualAction(style: .normal, title: animal.isFollowing ? "Deixar de Seguir" : "Seguir") { _, _, completionHandler in
            CoreDataManager.shared.toggleFollowing(for: animal)
            self.loadAnimals()
            completionHandler(true)
        }
        
        followAction.backgroundColor = animal.isFollowing ? .systemOrange : .systemGreen
        
        let configuration = UISwipeActionsConfiguration(actions: [followAction])
        return configuration
    }
}

// MARK: - Filter Delegate
extension AnimalListViewController: FilterViewControllerDelegate {
    func didApplyFilters(species: String?, breed: String?, gender: String?, age: String?) {
        print("Filtros aplicados: especie=\(species ?? "todas"), raca=\(breed ?? "todas"), genero=\(gender ?? "todos"), idade=\(age ?? "todas")")
        loadAnimals()
    }
}

// MARK: - Custom TableView Cell
class AnimalTableViewCell: UITableViewCell {
    
    private let nameLabel = UILabel()
    private let speciesLabel = UILabel()
    private let detailsLabel = UILabel()
    private let followButton = UIButton(type: .system)
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI() {
        nameLabel.font = .systemFont(ofSize: 18, weight: .bold)
        nameLabel.textColor = .label
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        
        speciesLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        speciesLabel.textColor = .systemBlue
        speciesLabel.translatesAutoresizingMaskIntoConstraints = false
        
        detailsLabel.font = .systemFont(ofSize: 13, weight: .regular)
        detailsLabel.textColor = .secondaryLabel
        detailsLabel.numberOfLines = 2
        detailsLabel.translatesAutoresizingMaskIntoConstraints = false
        
        followButton.setImage(UIImage(systemName: "heart"), for: .normal)
        followButton.translatesAutoresizingMaskIntoConstraints = false
        
        contentView.addSubview(nameLabel)
        contentView.addSubview(speciesLabel)
        contentView.addSubview(detailsLabel)
        contentView.addSubview(followButton)
        
        NSLayoutConstraint.activate([
            nameLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 12),
            nameLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            nameLabel.trailingAnchor.constraint(equalTo: followButton.leadingAnchor, constant: -12),
            
            speciesLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            speciesLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            
            detailsLabel.topAnchor.constraint(equalTo: speciesLabel.bottomAnchor, constant: 6),
            detailsLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            detailsLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            detailsLabel.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -12),
            
            followButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            followButton.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            followButton.widthAnchor.constraint(equalToConstant: 30),
            followButton.heightAnchor.constraint(equalToConstant: 30)
        ])
    }
    
    func configure(with animal: AnimalEntity) {
        nameLabel.text = animal.name ?? "Sem nome"
        speciesLabel.text = animal.species ?? "-"
        
        var details = ""
        if let breed = animal.breed, !breed.isEmpty {
            details += "Raça: \(breed)"
        }
        if let gender = animal.gender, !gender.isEmpty {
            details += details.isEmpty ? "" : " • "
            details += "Género: \(gender)"
        }
        
        detailsLabel.text = details.isEmpty ? "Sem detalhes" : details
        
        let heartImage = animal.isFollowing ? "heart.fill" : "heart"
        let heartColor: UIColor = animal.isFollowing ? .systemRed : .systemGray
        followButton.setImage(UIImage(systemName: heartImage), for: .normal)
        followButton.tintColor = heartColor
    }
}
