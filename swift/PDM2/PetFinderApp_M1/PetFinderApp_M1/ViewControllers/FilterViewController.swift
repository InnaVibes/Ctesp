import UIKit

protocol FilterViewControllerDelegate: AnyObject {
    func didApplyFilters(species: String?, breed: String?, gender: String?, age: String?)
}

class FilterViewController: UIViewController {
    
    weak var delegate: FilterViewControllerDelegate?
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let speciesLabel = UILabel()
    private let speciesSegmentedControl = UISegmentedControl(items: ["Todos", "Cão", "Gato"])
    
    private let breedLabel = UILabel()
    private let breedTextField = UITextField()
    
    private let genderLabel = UILabel()
    private let genderSegmentedControl = UISegmentedControl(items: ["Todos", "Macho", "Fêmea"])
    
    private let ageLabel = UILabel()
    private let ageSegmentedControl = UISegmentedControl(items: ["Todos", "Bebé", "Jovem", "Adulto", "Sénior"])
    
    private let applyButton = UIButton(type: .system)
    private let resetButton = UIButton(type: .system)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupConstraints()
    }
    
    private func setupUI() {
        title = "Filtros"
        view.backgroundColor = .systemBackground
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .cancel,
            target: self,
            action: #selector(cancelTapped)
        )
        
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        // Species
        speciesLabel.text = "Espécie"
        speciesLabel.font = .systemFont(ofSize: 16, weight: .semibold)
        speciesLabel.translatesAutoresizingMaskIntoConstraints = false
        speciesSegmentedControl.selectedSegmentIndex = 0
        speciesSegmentedControl.translatesAutoresizingMaskIntoConstraints = false
        
        // Breed
        breedLabel.text = "Raça"
        breedLabel.font = .systemFont(ofSize: 16, weight: .semibold)
        breedLabel.translatesAutoresizingMaskIntoConstraints = false
        
        breedTextField.placeholder = "Ex: Labrador"
        breedTextField.borderStyle = .roundedRect
        breedTextField.translatesAutoresizingMaskIntoConstraints = false
        
        // Gender
        genderLabel.text = "Género"
        genderLabel.font = .systemFont(ofSize: 16, weight: .semibold)
        genderLabel.translatesAutoresizingMaskIntoConstraints = false
        genderSegmentedControl.selectedSegmentIndex = 0
        genderSegmentedControl.translatesAutoresizingMaskIntoConstraints = false
        
        // Age
        ageLabel.text = "Idade"
        ageLabel.font = .systemFont(ofSize: 16, weight: .semibold)
        ageLabel.translatesAutoresizingMaskIntoConstraints = false
        ageSegmentedControl.selectedSegmentIndex = 0
        ageSegmentedControl.translatesAutoresizingMaskIntoConstraints = false
        
        // Buttons
        applyButton.setTitle("Aplicar Filtros", for: .normal)
        applyButton.backgroundColor = .petFinderPrimary
        applyButton.setTitleColor(.white, for: .normal)
        applyButton.layer.cornerRadius = 8
        applyButton.translatesAutoresizingMaskIntoConstraints = false
        applyButton.addTarget(self, action: #selector(applyTapped), for: .touchUpInside)
        
        resetButton.setTitle("Limpar Filtros", for: .normal)
        resetButton.setTitleColor(.petFinderDanger, for: .normal)
        resetButton.translatesAutoresizingMaskIntoConstraints = false
        resetButton.addTarget(self, action: #selector(resetTapped), for: .touchUpInside)
        
        contentView.addSubview(speciesLabel)
        contentView.addSubview(speciesSegmentedControl)
        contentView.addSubview(breedLabel)
        contentView.addSubview(breedTextField)
        contentView.addSubview(genderLabel)
        contentView.addSubview(genderSegmentedControl)
        contentView.addSubview(ageLabel)
        contentView.addSubview(ageSegmentedControl)
        contentView.addSubview(applyButton)
        contentView.addSubview(resetButton)
    }
    
    private func setupConstraints() {
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            speciesLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
            speciesLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            speciesLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            speciesSegmentedControl.topAnchor.constraint(equalTo: speciesLabel.bottomAnchor, constant: 8),
            speciesSegmentedControl.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            speciesSegmentedControl.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            breedLabel.topAnchor.constraint(equalTo: speciesSegmentedControl.bottomAnchor, constant: 24),
            breedLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            breedLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            breedTextField.topAnchor.constraint(equalTo: breedLabel.bottomAnchor, constant: 8),
            breedTextField.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            breedTextField.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            breedTextField.heightAnchor.constraint(equalToConstant: 40),
            
            genderLabel.topAnchor.constraint(equalTo: breedTextField.bottomAnchor, constant: 24),
            genderLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            genderLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            genderSegmentedControl.topAnchor.constraint(equalTo: genderLabel.bottomAnchor, constant: 8),
            genderSegmentedControl.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            genderSegmentedControl.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            ageLabel.topAnchor.constraint(equalTo: genderSegmentedControl.bottomAnchor, constant: 24),
            ageLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            ageLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            ageSegmentedControl.topAnchor.constraint(equalTo: ageLabel.bottomAnchor, constant: 8),
            ageSegmentedControl.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            ageSegmentedControl.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            applyButton.topAnchor.constraint(equalTo: ageSegmentedControl.bottomAnchor, constant: 32),
            applyButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            applyButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            applyButton.heightAnchor.constraint(equalToConstant: 50),
            
            resetButton.topAnchor.constraint(equalTo: applyButton.bottomAnchor, constant: 12),
            resetButton.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            resetButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -32)
        ])
    }
    
    @objc private func cancelTapped() {
        self.dismiss(animated: true, completion: nil)
    }
    
    @objc private func applyTapped() {
        let species: String?
        switch speciesSegmentedControl.selectedSegmentIndex {
        case 1: species = "dog"
        case 2: species = "cat"
        default: species = nil
        }
        
        let breed = breedTextField.text?.isEmpty == false ? breedTextField.text : nil
        
        let gender: String?
        switch genderSegmentedControl.selectedSegmentIndex {
        case 1: gender = "male"
        case 2: gender = "female"
        default: gender = nil
        }
        
        let age: String?
        switch ageSegmentedControl.selectedSegmentIndex {
        case 1: age = "baby"
        case 2: age = "young"
        case 3: age = "adult"
        case 4: age = "senior"
        default: age = nil
        }
        
        delegate?.didApplyFilters(species: species, breed: breed, gender: gender, age: age)
        self.dismiss(animated: true, completion: nil)
    }
    
    @objc private func resetTapped() {
        speciesSegmentedControl.selectedSegmentIndex = 0
        breedTextField.text = ""
        genderSegmentedControl.selectedSegmentIndex = 0
        ageSegmentedControl.selectedSegmentIndex = 0
    }
}
