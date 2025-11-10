import UIKit
import CoreData

// MARK: - Following View Controller
class FollowingViewController: UIViewController {
    
    // MARK: - Properties
    private var followingAnimals: [Animal] = []
    private let tableView = UITableView()
    
    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupTableView()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        loadFollowingAnimals()
    }
    
    // MARK: - Setup UI
    private func setupUI() {
        title = "Animais que Segue"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
    }
    
    private func setupTableView() {
        tableView.frame = view.bounds
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(AnimalTableViewCell.self, forCellReuseIdentifier: "AnimalCell")
        tableView.rowHeight = UITableView.automaticDimension
        tableView.estimatedRowHeight = 120
        
        view.addSubview(tableView)
    }
    
    // MARK: - Load Following Animals
    private func loadFollowingAnimals() {
        followingAnimals = CoreDataManager.shared.getFollowingAnimals()
        tableView.reloadData()
    }
}

// MARK: - UITableViewDataSource
extension FollowingViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return followingAnimals.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AnimalCell", for: indexPath) as! AnimalTableViewCell
        // Configurar célula (será necessário converter AnimalEntity para Animal)
        return cell
    }
}

// MARK: - UITableViewDelegate
extension FollowingViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let animal = followingAnimals[indexPath.row]
        let detailVC = AnimalDetailViewController(animal: animal)
        navigationController?.pushViewController(detailVC, animated: true)
    }
}
