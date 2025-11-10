import UIKit

// MARK: - Filter Delegate
protocol FilterViewControllerDelegate: AnyObject {
    func didApplyFilters(species: String, breed: String, gender: String, age: String)
}

// MARK: - Filter View Controller
class FilterViewController: UIViewController {
    
    // MARK: - Properties
    weak var delegate: FilterViewControllerDelegate?
    private var selectedSpecies = ""
    private var selectedBreed = ""
    private var selectedGender = ""
    private var selectedAge = ""
    
    // MARK: - UI Components
    private let tableView = UITableView(frame: .zero, style: .grouped)
    
    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupTableView()
    }
    
    // MARK: - Setup UI
    private func setupUI() {
        title = "Filtros"
        view.backgroundColor = .systemBackground
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Cancelar", style: .plain, target: self, action: #selector(dismiss))
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Aplicar", style: .done, target: self, action: #selector(applyFilters))
    }
    
    private func setupTableView() {
        tableView.frame = view.bounds
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "FilterCell")
        
        view.addSubview(tableView)
    }
    
    // MARK: - Actions
    @objc private func dismiss() {
        self.dismiss(animated: true)
    }
    
    @objc private func applyFilters() {
        delegate?.didApplyFilters(species: selectedSpecies, breed: selectedBreed,
                                 gender: selectedGender, age: selectedAge)
        self.dismiss(animated: true)
    }
}

// MARK: - UITableViewDataSource
extension FilterViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 4
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0: return 3 // Dog, Cat, Rabbit
        case 1: return 4 // Common breeds
        case 2: return 2 // Male, Female
        case 3: return 4 // Age ranges
        default: return 0
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FilterCell", for: indexPath)
        
        switch indexPath.section {
        case 0: // Species
            let species = ["dog", "cat", "rabbit"]
            cell.textLabel?.text = species[indexPath.row].capitalized
            cell.accessoryType = selectedSpecies == species[indexPath.row] ? .checkmark : .none
            
        case 1: // Breed
            let breeds = ["Labrador", "Persa", "Orelha de Coelho", "Sem Filtro"]
            cell.textLabel?.text = breeds[indexPath.row]
            cell.accessoryType = selectedBreed == breeds[indexPath.row] ? .checkmark : .none
            
        case 2: // Gender
            let genders = ["Macho", "Fêmea"]
            cell.textLabel?.text = genders[indexPath.row]
            cell.accessoryType = selectedGender == genders[indexPath.row] ? .checkmark : .none
            
        case 3: // Age
            let ages = ["Jovem", "Adulto", "Idoso", "Sem Filtro"]
            cell.textLabel?.text = ages[indexPath.row]
            cell.accessoryType = selectedAge == ages[indexPath.row] ? .checkmark : .none
            
        default:
            break
        }
        
        return cell
    }
}

// MARK: - UITableViewDelegate
extension FilterViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case 0: return "Espécie"
        case 1: return "Raça"
        case 2: return "Género"
        case 3: return "Idade"
        default: return nil
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        switch indexPath.section {
        case 0:
            let species = ["dog", "cat", "rabbit"]
            selectedSpecies = species[indexPath.row]
            
        case 1:
            let breeds = ["Labrador", "Persa", "Orelha de Coelho", ""]
            selectedBreed = breeds[indexPath.row]
            
        case 2:
            let genders = ["male", "female"]
            selectedGender = genders[indexPath.row]
            
        case 3:
            let ages = ["young", "adult", "senior", ""]
            selectedAge = ages[indexPath.row]
            
        default:
            break
        }
        
        tableView.reloadSections([indexPath.section], with: .none)
    }
}
