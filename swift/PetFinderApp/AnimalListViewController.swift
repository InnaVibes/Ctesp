import UIKit

// MARK: - Animal List View Controller
class AnimalListViewController: UIViewController {
    
    // MARK: - Properties
    private var animals: [Animal] = []
    private var currentPage = 1
    private var isLoading = false
    private var filteredSpecies = ""
    private var filteredBreed = ""
    private var filteredGender = ""
    private var filteredAge = ""
    
    // MARK: - UI Components
    private let tableView = UITableView()
    private let refreshControl = UIRefreshControl()
    private let searchBar = UISearchBar()
    private var filterButton: UIBarButtonItem?
    
    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupTableView()
        setupSearchBar()
        fetchAnimals()
    }
    
    // MARK: - Setup UI
    private func setupUI() {
        title = "Animais para Adoção"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
        
        // Filter button
        filterButton = UIBarButtonItem(image: UIImage(systemName: "slider.horizontal.3"),
                                       style: .plain, target: self, action: #selector(showFilters))
        navigationItem.rightBarButtonItem = filterButton
    }
    
    private func setupTableView() {
        tableView.frame = view.bounds
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(AnimalTableViewCell.self, forCellReuseIdentifier: "AnimalCell")
        tableView.rowHeight = UITableView.automaticDimension
        tableView.estimatedRowHeight = 120
        
        // Refresh control
        refreshControl.addTarget(self, action: #selector(refreshAnimals), for: .valueChanged)
        tableView.refreshControl = refreshControl
        
        view.addSubview(tableView)
    }
    
    private func setupSearchBar() {
        searchBar.placeholder = "Pesquisar animal..."
        searchBar.delegate = self
        navigationItem.titleView = searchBar
    }
    
    // MARK: - Fetch Animals
    private func fetchAnimals(page: Int = 1) {
        guard !isLoading else { return }
        isLoading = true
        
        DispatchQueue.global(qos: .userInitiated).async {
            PetFinderService.shared.fetchAnimals(
                species: self.filteredSpecies,
                breed: self.filteredBreed,
                gender: self.filteredGender,
                age: self.filteredAge,
                page: page,
                limit: UserDefaults.standard.integer(forKey: "itemsPerPage") > 0 ? 
                    UserDefaults.standard.integer(forKey: "itemsPerPage") : 20
            ) { [weak self] result in
                DispatchQueue.main.async {
                    self?.isLoading = false
                    self?.refreshControl.endRefreshing()
                    
                    switch result {
                    case .success(let response):
                        if page == 1 {
                            self?.animals = response.animals
                        } else {
                            self?.animals.append(contentsOf: response.animals)
                        }
                        self?.currentPage = page
                        
                        // Cache dos animais
                        CacheService.shared.cacheAnimals(self?.animals ?? [], for: "animals")
                        self?.tableView.reloadData()
                        
                    case .failure(let error):
                        print("Erro ao buscar animais: \(error)")
                        self?.showError("Erro ao carregar animais. Tente novamente.")
                    }
                }
            }
        }
    }
    
    @objc private func refreshAnimals() {
        currentPage = 1
        animals.removeAll()
        fetchAnimals()
    }
    
    @objc private func showFilters() {
        let filterVC = FilterViewController()
        filterVC.delegate = self
        let navController = UINavigationController(rootViewController: filterVC)
        present(navController, animated: true)
    }
    
    // MARK: - Error Handling
    private func showError(_ message: String) {
        let alert = UIAlertController(title: "Erro", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

// MARK: - UITableViewDataSource
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

// MARK: - UITableViewDelegate
extension AnimalListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let animal = animals[indexPath.row]
        let detailVC = AnimalDetailViewController(animal: animal)
        navigationController?.pushViewController(detailVC, animated: true)
    }
    
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        // Carregamento infinito
        if indexPath.row == animals.count - 5 {
            fetchAnimals(page: currentPage + 1)
        }
    }
}

// MARK: - UISearchBarDelegate
extension AnimalListViewController: UISearchBarDelegate {
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        filteredSpecies = searchBar.text ?? ""
        currentPage = 1
        animals.removeAll()
        fetchAnimals()
        searchBar.resignFirstResponder()
    }
}

// MARK: - FilterViewController Delegate
extension AnimalListViewController: FilterViewControllerDelegate {
    func didApplyFilters(species: String, breed: String, gender: String, age: String) {
        filteredSpecies = species
        filteredBreed = breed
        filteredGender = gender
        filteredAge = age
        currentPage = 1
        animals.removeAll()
        fetchAnimals()
    }
}
