import UIKit

class PetDetailViewController: UIViewController {
    
    private let pet: PetUnifiedModel
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let imageView = UIImageView()
    private let nameLabel = UILabel()
    private let speciesLabel = UILabel()
    private let detailsStackView = UIStackView()
    
    init(pet: PetUnifiedModel) {
        self.pet = pet
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) not implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        configureWithPet()
        
        // Track animal viewed
        AchievementsManager.shared.incrementAnimalsViewed()
    }
    
    private func setupUI() {
        title = "Detalhes"
        view.backgroundColor = .systemBackground
        
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        imageView.contentMode = .scaleAspectFill
        imageView.clipsToBounds = true
        imageView.backgroundColor = .systemGray5
        imageView.translatesAutoresizingMaskIntoConstraints = false
        
        nameLabel.font = .systemFont(ofSize: 28, weight: .bold)
        nameLabel.numberOfLines = 0
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        
        speciesLabel.font = .systemFont(ofSize: 18, weight: .semibold)
        speciesLabel.textColor = .systemBlue
        speciesLabel.translatesAutoresizingMaskIntoConstraints = false
        
        detailsStackView.axis = .vertical
        detailsStackView.spacing = UIConstants.mediumSpacing
        detailsStackView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        contentView.addSubview(imageView)
        contentView.addSubview(nameLabel)
        contentView.addSubview(speciesLabel)
        contentView.addSubview(detailsStackView)
        
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
            
            imageView.topAnchor.constraint(equalTo: contentView.topAnchor),
            imageView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            imageView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            imageView.heightAnchor.constraint(equalToConstant: 300),
            
            nameLabel.topAnchor.constraint(equalTo: imageView.bottomAnchor, constant: UIConstants.mediumSpacing),
            nameLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: UIConstants.mediumSpacing),
            nameLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -UIConstants.mediumSpacing),
            
            speciesLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: UIConstants.smallSpacing),
            speciesLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: UIConstants.mediumSpacing),
            speciesLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -UIConstants.mediumSpacing),
            
            detailsStackView.topAnchor.constraint(equalTo: speciesLabel.bottomAnchor, constant: UIConstants.largeSpacing),
            detailsStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: UIConstants.mediumSpacing),
            detailsStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -UIConstants.mediumSpacing),
            detailsStackView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -UIConstants.largeSpacing)
        ])
        
        // Add share button
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .action,
            target: self,
            action: #selector(shareTapped)
        )
    }
    
    private func configureWithPet() {
        nameLabel.text = pet.name
        speciesLabel.text = pet.formattedSpecies
        
        addDetailRow(title: "Raça", value: pet.formattedBreed)
        addDetailRow(title: "Sexo", value: pet.formattedGender)
        addDetailRow(title: "Idade", value: pet.formattedAge)
        addDetailRow(title: "Tamanho", value: pet.size)
        addDetailRow(title: "Localização", value: pet.formattedLocation)
        
        if let description = pet.descriptionText, !description.isEmpty {
            addDetailRow(title: "Descrição", value: description)
        }
        
        if let photoURLString = pet.largePhotoURL ?? pet.photoURL, let photoURL = URL(string: photoURLString) {
            loadImage(from: photoURL)
        } else {
            imageView.image = UIImage(systemName: "photo")
            imageView.tintColor = .systemGray3
        }
    }
    
    private func addDetailRow(title: String, value: String) {
        let containerView = UIView()
        containerView.translatesAutoresizingMaskIntoConstraints = false
        
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        titleLabel.textColor = .secondaryLabel
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let valueLabel = UILabel()
        valueLabel.text = value
        valueLabel.font = .systemFont(ofSize: 16, weight: .regular)
        valueLabel.numberOfLines = 0
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
        
        containerView.addSubview(titleLabel)
        containerView.addSubview(valueLabel)
        
        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: containerView.topAnchor),
            titleLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            titleLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            
            valueLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            valueLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            valueLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            valueLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor)
        ])
        
        detailsStackView.addArrangedSubview(containerView)
    }
    
    private func loadImage(from url: URL) {
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            guard let data = data, let image = UIImage(data: data) else { return }
            DispatchQueue.main.async {
                self?.imageView.image = image
            }
        }.resume()
    }
    
    @objc private func shareTapped() {
        let text = "Conheça o \(pet.name)! \(pet.descriptionText ?? "") - Localização: \(pet.formattedLocation)"
        let activityVC = UIActivityViewController(activityItems: [text], applicationActivities: nil)
        
        // Track share
        activityVC.completionWithItemsHandler = { _, completed, _, _ in
            if completed {
                AchievementsManager.shared.incrementShareCount()
            }
        }
        
        present(activityVC, animated: true)
    }
}
