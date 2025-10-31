import UIKit

// MARK: - Achievements View Controller
class AchievementsViewController: UIViewController {
    
    // MARK: - Properties
    private let collectionView: UICollectionView
    
    // MARK: - Init
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
        let layout = UICollectionViewFlowLayout()
        layout.itemSize = CGSize(width: 150, height: 170)
        layout.minimumLineSpacing = 16
        layout.minimumInteritemSpacing = 16
        layout.sectionInset = UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16)
        
        self.collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupCollectionView()
    }
    
    // MARK: - Setup UI
    private func setupUI() {
        title = "Conquistas"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
        
        collectionView.translatesAutoresizingMaskIntoConstraints = false
        collectionView.backgroundColor = .systemBackground
        view.addSubview(collectionView)
        
        NSLayoutConstraint.activate([
            collectionView.topAnchor.constraint(equalTo: view.topAnchor),
            collectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            collectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            collectionView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func setupCollectionView() {
        collectionView.dataSource = self
        collectionView.delegate = self
        collectionView.register(AchievementCollectionViewCell.self, forCellWithReuseIdentifier: "AchievementCell")
    }
}

// MARK: - UICollectionViewDataSource
extension AchievementsViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return AchievementService.shared.achievements.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "AchievementCell", for: indexPath) as! AchievementCollectionViewCell
        let achievement = AchievementService.shared.achievements[indexPath.item]
        let unlockedAchievements = AchievementService.shared.getUnlockedAchievements()
        let isUnlocked = unlockedAchievements.contains(achievement.id)
        cell.configure(with: achievement, isUnlocked: isUnlocked)
        return cell
    }
}

// MARK: - UICollectionViewDelegate
extension AchievementsViewController: UICollectionViewDelegate {}

// MARK: - Achievement Collection View Cell
class AchievementCollectionViewCell: UICollectionViewCell {
    
    private let iconLabel = UILabel()
    private let titleLabel = UILabel()
    private let descriptionLabel = UILabel()
    private let lockedView = UIView()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI() {
        contentView.backgroundColor = .secondarySystemBackground
        contentView.layer.cornerRadius = 12
        
        iconLabel.font = UIFont.systemFont(ofSize: 40)
        iconLabel.textAlignment = .center
        iconLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(iconLabel)
        
        titleLabel.font = UIFont.boldSystemFont(ofSize: 14)
        titleLabel.textAlignment = .center
        titleLabel.numberOfLines = 2
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(titleLabel)
        
        descriptionLabel.font = UIFont.systemFont(ofSize: 10)
        descriptionLabel.textColor = .secondaryLabel
        descriptionLabel.textAlignment = .center
        descriptionLabel.numberOfLines = 2
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(descriptionLabel)
        
        lockedView.backgroundColor = UIColor.black.withAlphaComponent(0.4)
        lockedView.layer.cornerRadius = 12
        lockedView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(lockedView)
        
        NSLayoutConstraint.activate([
            iconLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 12),
            iconLabel.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            
            titleLabel.topAnchor.constraint(equalTo: iconLabel.bottomAnchor, constant: 8),
            titleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 8),
            titleLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -8),
            
            descriptionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            descriptionLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 8),
            descriptionLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -8),
            descriptionLabel.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8),
            
            lockedView.topAnchor.constraint(equalTo: contentView.topAnchor),
            lockedView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            lockedView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            lockedView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor)
        ])
    }
    
    func configure(with achievement: Achievement, isUnlocked: Bool) {
        iconLabel.text = achievement.icon
        titleLabel.text = achievement.title
        descriptionLabel.text = achievement.description
        
        if isUnlocked {
            lockedView.isHidden = true
            contentView.backgroundColor = .systemGreen.withAlphaComponent(0.2)
        } else {
            lockedView.isHidden = false
            contentView.backgroundColor = .secondarySystemBackground
        }
    }
}
