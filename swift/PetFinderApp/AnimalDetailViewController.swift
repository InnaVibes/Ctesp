import UIKit

// MARK: - Animal Detail View Controller
class AnimalDetailViewController: UIViewController {
    
    // MARK: - Properties
    private let animal: Animal
    private var isFollowing = false
    
    // MARK: - UI Components
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let photoCollectionView: UICollectionView
    private let nameLabel = UILabel()
    private let basicInfoLabel = UILabel()
    private let descriptionLabel = UILabel()
    private let followButton = UIButton(type: .system)
    private let shareButton = UIButton(type: .system)
    private let randomButton = UIButton(type: .system)
    
    // MARK: - Init
    init(animal: Animal) {
        self.animal = animal
        
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .horizontal
        layout.itemSize = CGSize(width: 200, height: 200)
        layout.minimumLineSpacing = 8
        self.photoCollectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupCollectionView()
        configureUI()
        checkIfFollowing()
    }
    
    // MARK: - Setup UI
    private func setupUI() {
        view.backgroundColor = .systemBackground
        title = animal.name
        navigationController?.navigationBar.prefersLargeTitles = false
        
        // Scroll View
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
        
        contentView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        
        // Photo Collection View
        photoCollectionView.translatesAutoresizingMaskIntoConstraints = false
        photoCollectionView.backgroundColor = .secondarySystemBackground
        photoCollectionView.register(PhotoCollectionViewCell.self, forCellWithReuseIdentifier: "PhotoCell")
        contentView.addSubview(photoCollectionView)
        
        // Name Label
        nameLabel.font = UIFont.boldSystemFont(ofSize: 24)
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(nameLabel)
        
        // Basic Info
        basicInfoLabel.font = UIFont.systemFont(ofSize: 14)
        basicInfoLabel.textColor = .secondaryLabel
        basicInfoLabel.numberOfLines = 0
        basicInfoLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(basicInfoLabel)
        
        // Description
        descriptionLabel.font = UIFont.systemFont(ofSize: 14)
        descriptionLabel.numberOfLines = 0
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(descriptionLabel)
        
        // Buttons
        followButton.translatesAutoresizingMaskIntoConstraints = false
        followButton.addTarget(self, action: #selector(toggleFollow), for: .touchUpInside)
        contentView.addSubview(followButton)
        
        shareButton.setTitle("Partilhar", for: .normal)
        shareButton.translatesAutoresizingMaskIntoConstraints = false
        shareButton.addTarget(self, action: #selector(shareAnimal), for: .touchUpInside)
        contentView.addSubview(shareButton)
        
        randomButton.setTitle("Animal Aleatório", for: .normal)
        randomButton.translatesAutoresizingMaskIntoConstraints = false
        randomButton.addTarget(self, action: #selector(fetchRandom), for: .touchUpInside)
        contentView.addSubview(randomButton)
        
        // Constraints
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
            
            photoCollectionView.topAnchor.constraint(equalTo: contentView.topAnchor),
            photoCollectionView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            photoCollectionView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            photoCollectionView.heightAnchor.constraint(equalToConstant: 200),
            
            nameLabel.topAnchor.constraint(equalTo: photoCollectionView.bottomAnchor, constant: 16),
            nameLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            nameLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            
            basicInfoLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 8),
            basicInfoLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            basicInfoLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            
            descriptionLabel.topAnchor.constraint(equalTo: basicInfoLabel.bottomAnchor, constant: 16),
            descriptionLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            descriptionLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            
            followButton.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 16),
            followButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            followButton.trailingAnchor.constraint(equalTo: shareButton.leadingAnchor, constant: -8),
            followButton.widthAnchor.constraint(equalTo: shareButton.widthAnchor),
            
            shareButton.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 16),
            shareButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            
            randomButton.topAnchor.constraint(equalTo: followButton.bottomAnchor, constant: 8),
            randomButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            randomButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            randomButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -16)
        ])
    }
    
    private func setupCollectionView() {
        photoCollectionView.dataSource = self
        photoCollectionView.delegate = self
    }
    
    // MARK: - Configure UI
    private func configureUI() {
        nameLabel.text = animal.name
        
        var infoText = "\(animal.species) • \(animal.breed)\n"
        infoText += "\(animal.gender) • \(animal.age)"
        if let size = animal.size {
            infoText += " • \(size)"
        }
        basicInfoLabel.text = infoText
        
        descriptionLabel.text = animal.description ?? "Sem descrição disponível"
    }
    
    // MARK: - Check Following Status
    private func checkIfFollowing() {
        // Implementar verificação de status de seguimento
        updateFollowButton()
    }
    
    private func updateFollowButton() {
        if isFollowing {
            followButton.setTitle("✓ Seguindo", for: .normal)
            followButton.setTitleColor(.systemGreen, for: .normal)
        } else {
            followButton.setTitle("❤️ Seguir", for: .normal)
            followButton.setTitleColor(.systemRed, for: .normal)
        }
    }
    
    // MARK: - Actions
    @objc private func toggleFollow() {
        isFollowing.toggle()
        updateFollowButton()
        
        // Salvar no CoreData
        // TODO: Implementar persistência
        
        // Atualizar achievements
        let following = CoreDataManager.shared.getFollowingCount()
        AchievementService.shared.updateFollowingProgress(count: following)
        
        let message = isFollowing ? "Animal adicionado à lista!" : "Animal removido da lista!"
        NotificationService.shared.sendImmediateNotification(title: "Atualizado", body: message)
    }
    
    @objc private func shareAnimal() {
        var shareText = "Vê este animal incrível: \(animal.name)!\n"
        shareText += "Espécie: \(animal.species)\n"
        shareText += "Raça: \(animal.breed)"
        
        let activityVC = UIActivityViewController(activityItems: [shareText], applicationActivities: nil)
        present(activityVC, animated: true)
    }
    
    @objc private func fetchRandom() {
        PetFinderService.shared.fetchRandomAnimal { result in
            switch result {
            case .success(let animal):
                let randomVC = AnimalDetailViewController(animal: animal)
                self.navigationController?.pushViewController(randomVC, animated: true)
                
                // Disparar notificação
                NotificationService.shared.sendImmediateNotification(
                    title: "Animal Aleatório",
                    body: "Descobre \(animal.name)!"
                )
            case .failure(let error):
                print("Erro: \(error)")
            }
        }
    }
}

// MARK: - UICollectionViewDataSource
extension AnimalDetailViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return animal.photoURLs?.count ?? 0
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "PhotoCell", for: indexPath) as! PhotoCollectionViewCell
        if let photoURLs = animal.photoURLs, indexPath.item < photoURLs.count {
            cell.configure(with: photoURLs[indexPath.item])
        }
        return cell
    }
}

// MARK: - UICollectionViewDelegate
extension AnimalDetailViewController: UICollectionViewDelegate {}

// MARK: - Photo Collection View Cell
class PhotoCollectionViewCell: UICollectionViewCell {
    private let imageView = UIImageView()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        imageView.contentMode = .scaleAspectFill
        imageView.clipsToBounds = true
        imageView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(imageView)
        
        NSLayoutConstraint.activate([
            imageView.topAnchor.constraint(equalTo: contentView.topAnchor),
            imageView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            imageView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            imageView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor)
        ])
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func configure(with urlString: String) {
        if let url = URL(string: urlString) {
            URLSession.shared.dataTask(with: url) { data, _, _ in
                if let data = data {
                    DispatchQueue.main.async {
                        self.imageView.image = UIImage(data: data)
                    }
                }
            }.resume()
        }
    }
}
