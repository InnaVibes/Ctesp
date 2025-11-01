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
        
        // Make navigation bar transparent so content scrolls behind
        navigationController?.navigationBar.scrollEdgeAppearance = UINavigationBarAppearance()
        
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
        cell.delegate = self
        return cell
    }
}

// MARK: - TableView Delegate
extension AnimalListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let animal = animals[indexPath.row]
        let detailVC = AnimalDetailViewController(animal: animal)
        navigationController?.pushViewController(detailVC, animated: true)
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
        print("Filtros: especie=\(species ?? "todas"), raca=\(breed ?? "todas"), genero=\(gender ?? "todos"), idade=\(age ?? "todas")")
        loadAnimals()
    }
}

// MARK: - Animal Cell Delegate
extension AnimalListViewController: AnimalTableViewCellDelegate {
    func animalCellDidTapFavorite(_ cell: AnimalTableViewCell, animal: AnimalEntity) {
        CoreDataManager.shared.toggleFollowing(for: animal)
        loadAnimals()
    }
}
