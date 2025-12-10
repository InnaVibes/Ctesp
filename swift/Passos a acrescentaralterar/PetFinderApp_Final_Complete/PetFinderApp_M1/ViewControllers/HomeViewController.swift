import UIKit

class HomeViewController: UIViewController {
    
    private let tableView = UITableView()
    private let networkManager = NetworkManager.shared
    private var pets: [PetUnifiedModel] = []
    private let refreshControl = UIRefreshControl()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        loadPets()
    }
    
    private func setupUI() {
        title = "Animais"
        view.backgroundColor = .systemBackground
        
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(AnimalTableViewCell.self, forCellReuseIdentifier: UIConstants.animalCellIdentifier)
        tableView.rowHeight = UIConstants.tableRowHeight
        tableView.translatesAutoresizingMaskIntoConstraints = false
        
        refreshControl.addTarget(self, action: #selector(refreshPets), for: .valueChanged)
        tableView.refreshControl = refreshControl
        
        view.addSubview(tableView)
        
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .refresh,
            target: self,
            action: #selector(refreshPets)
        )
    }
    
    private func loadPets() {
        LoadingHelper.show(on: self, message: "Carregando animais...")
        
        networkManager.fetchPets { [weak self] result in
            guard let self = self else { return }
            
            LoadingHelper.hide {
                switch result {
                case .success(let pets):
                    self.pets = pets
                    self.tableView.reloadData()
                    
                case .failure(let error):
                    AlertHelper.showError(on: self, error: error)
                }
            }
        }
    }
    
    @objc private func refreshPets() {
        networkManager.fetchPets(forceRefresh: true) { [weak self] result in
            guard let self = self else { return }
            
            self.refreshControl.endRefreshing()
            
            switch result {
            case .success(let pets):
                self.pets = pets
                self.tableView.reloadData()
                
            case .failure(let error):
                AlertHelper.showError(on: self, error: error)
            }
        }
    }
}

// MARK: - UITableViewDataSource
extension HomeViewController: UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return pets.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: UIConstants.animalCellIdentifier, for: indexPath) as! AnimalTableViewCell
        let pet = pets[indexPath.row]
        cell.configure(with: pet, isFollowing: false)
        cell.delegate = self
        return cell
    }
}

// MARK: - UITableViewDelegate
extension HomeViewController: UITableViewDelegate {
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let pet = pets[indexPath.row]
        
        let detailVC = PetDetailViewController(pet: pet)
        navigationController?.pushViewController(detailVC, animated: true)
    }
}

// MARK: - AnimalTableViewCellDelegate
extension HomeViewController: AnimalTableViewCellDelegate {
    
    func animalCellDidTapFavorite(_ cell: AnimalTableViewCell, animalId: Int64) {
        // TODO: Implementar lógica de favoritos com Core Data
        AlertHelper.showAlert(on: self, title: "Favorito", message: "Funcionalidade em desenvolvimento")
    }
}
