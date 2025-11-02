import UIKit

class AnimalDetailViewController: UIViewController {
    
    private let animal: AnimalEntity
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let photoView = UIView()
    private let nameLabel = UILabel()
    private let favoriteButton = UIButton(type: .system)
    
    private let speciesLabel = UILabel()
    private let breedLabel = UILabel()
    private let genderLabel = UILabel()
    private let ageLabel = UILabel()
    private let locationLabel = UILabel()
    
    private let descriptionTitleLabel = UILabel()
    private let descriptionLabel = UILabel()
    
    private let shareButton = UIButton(type: .system)
    private let contactButton = UIButton(type: .system)
    
    init(animal: AnimalEntity) {
        self.animal = animal
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupConstraints()
        updateUI()
    }
    
    private func setupUI() {
        view.backgroundColor = .systemBackground
        navigationItem.largeTitleDisplayMode = .never
        
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        photoView.backgroundColor = .systemGray5
        photoView.layer.cornerRadius = 12
        photoView.clipsToBounds = true
        photoView.translatesAutoresizingMaskIntoConstraints = false
        
        let photoLabel = UILabel()
        photoLabel.text = "📷"
        photoLabel.font = UIFont.systemFont(ofSize: 60)
        photoLabel.textAlignment = .center
        photoLabel.translatesAutoresizingMaskIntoConstraints = false
        photoView.addSubview(photoLabel)
        
        NSLayoutConstraint.activate([
            photoLabel.centerXAnchor.constraint(equalTo: photoView.centerXAnchor),
            photoLabel.centerYAnchor.constraint(equalTo: photoView.centerYAnchor)
        ])
        
        contentView.addSubview(photoView)
        
        nameLabel.font = .systemFont(ofSize: 28, weight: .bold)
        nameLabel.textColor = .label
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(nameLabel)
        
        favoriteButton.setImage(UIImage(systemName: "heart"), for: .normal)
        favoriteButton.setImage(UIImage(systemName: "heart.fill"), for: .selected)
        favoriteButton.translatesAutoresizingMaskIntoConstraints = false
        favoriteButton.addTarget(self, action: #selector(favoriteTapped), for: .touchUpInside)
        contentView.addSubview(favoriteButton)
        
        let infoStackView = UIStackView()
        infoStackView.axis = .vertical
        infoStackView.spacing = 12
        infoStackView.translatesAutoresizingMaskIntoConstraints = false
        
        speciesLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        speciesLabel.textColor = .secondaryLabel
        speciesLabel.translatesAutoresizingMaskIntoConstraints = false
        infoStackView.addArrangedSubview(speciesLabel)
        
        breedLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        breedLabel.textColor = .secondaryLabel
        breedLabel.translatesAutoresizingMaskIntoConstraints = false
        infoStackView.addArrangedSubview(breedLabel)
        
        genderLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        genderLabel.textColor = .secondaryLabel
        genderLabel.translatesAutoresizingMaskIntoConstraints = false
        infoStackView.addArrangedSubview(genderLabel)
        
        ageLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        ageLabel.textColor = .secondaryLabel
        ageLabel.translatesAutoresizingMaskIntoConstraints = false
        infoStackView.addArrangedSubview(ageLabel)
        
        locationLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        locationLabel.textColor = .secondaryLabel
        locationLabel.translatesAutoresizingMaskIntoConstraints = false
        infoStackView.addArrangedSubview(locationLabel)
        
        contentView.addSubview(infoStackView)
        
        descriptionTitleLabel.text = "Sobre"
        descriptionTitleLabel.font = .systemFont(ofSize: 18, weight: .bold)
        descriptionTitleLabel.textColor = .label
        descriptionTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(descriptionTitleLabel)
        
        descriptionLabel.font = .systemFont(ofSize: 14, weight: .regular)
        descriptionLabel.textColor = .secondaryLabel
        descriptionLabel.numberOfLines = 0
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(descriptionLabel)
        
        shareButton.setTitle("Partilhar", for: .normal)
        shareButton.backgroundColor = .systemBlue
        shareButton.setTitleColor(.white, for: .normal)
        shareButton.layer.cornerRadius = 8
        shareButton.translatesAutoresizingMaskIntoConstraints = false
        shareButton.addTarget(self, action: #selector(shareTapped), for: .touchUpInside)
        contentView.addSubview(shareButton)
        
        contactButton.setTitle("Contactar", for: .normal)
        contactButton.backgroundColor = .systemGreen
        contactButton.setTitleColor(.white, for: .normal)
        contactButton.layer.cornerRadius = 8
        contactButton.translatesAutoresizingMaskIntoConstraints = false
        contactButton.addTarget(self, action: #selector(contactTapped), for: .touchUpInside)
        contentView.addSubview(contactButton)
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
            
            photoView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
            photoView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            photoView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            photoView.heightAnchor.constraint(equalToConstant: 200),
            
            nameLabel.topAnchor.constraint(equalTo: photoView.bottomAnchor, constant: 20),
            nameLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            nameLabel.trailingAnchor.constraint(equalTo: favoriteButton.leadingAnchor, constant: -12),
            
            favoriteButton.centerYAnchor.constraint(equalTo: nameLabel.centerYAnchor),
            favoriteButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            favoriteButton.widthAnchor.constraint(equalToConstant: 44),
            favoriteButton.heightAnchor.constraint(equalToConstant: 44),
            
            speciesLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 16),
            speciesLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            speciesLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            breedLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            breedLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            genderLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            genderLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            ageLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            ageLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            locationLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            locationLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            descriptionTitleLabel.topAnchor.constraint(equalTo: locationLabel.bottomAnchor, constant: 24),
            descriptionTitleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            descriptionTitleLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            descriptionLabel.topAnchor.constraint(equalTo: descriptionTitleLabel.bottomAnchor, constant: 8),
            descriptionLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            descriptionLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            shareButton.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 24),
            shareButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            shareButton.trailingAnchor.constraint(equalTo: contentView.centerXAnchor, constant: -6),
            shareButton.heightAnchor.constraint(equalToConstant: 50),
            
            contactButton.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 24),
            contactButton.leadingAnchor.constraint(equalTo: contentView.centerXAnchor, constant: 6),
            contactButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            contactButton.heightAnchor.constraint(equalToConstant: 50),
            contactButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20)
        ])
    }
    
    private func updateUI() {
        title = animal.name ?? "Animal"
        nameLabel.text = animal.name ?? "Sem nome"
        
        speciesLabel.text = "🐾 Espécie: \(animal.species ?? "-")"
        breedLabel.text = "🏷️ Raça: \(animal.breed ?? "-")"
        genderLabel.text = "👥 Género: \(animal.gender ?? "-")"
        ageLabel.text = "📅 Idade: \(animal.age ?? "-")"
        locationLabel.text = "📍 Localização: \(animal.location ?? "-")"
        
        descriptionLabel.text = animal.descriptionText ?? "Sem informações disponíveis"
        
        favoriteButton.isSelected = animal.isFollowing
        favoriteButton.tintColor = animal.isFollowing ? .systemRed : .systemGray
    }
    
    @objc private func favoriteTapped() {
        CoreDataManager.shared.toggleFollowing(for: animal)
        updateUI()
    }
    
    @objc private func shareTapped() {
        let text = "Conheça o \(animal.name ?? "animal")! \(animal.descriptionText ?? "") - Localização: \(animal.location ?? "-")"
        let activityVC = UIActivityViewController(activityItems: [text], applicationActivities: nil)
        present(activityVC, animated: true)
    }
    
    @objc private func contactTapped() {
        let alert = UIAlertController(title: "Contactar", message: "Em desenvolvimento. Será possível contactar diretamente pela app em breve.", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
