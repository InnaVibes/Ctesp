import UIKit

class AchievementsViewController: UIViewController {
    
    private let collectionView: UICollectionView = {
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .vertical
        layout.minimumLineSpacing = 16
        layout.minimumInteritemSpacing = 16
        layout.sectionInset = UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16)
        
        let itemWidth = (UIScreen.main.bounds.width - 16 * 3) / 2
        layout.itemSize = CGSize(width: itemWidth, height: itemWidth)
        
        return UICollectionView(frame: .zero, collectionViewLayout: layout)
    }()
    
    private let emptyLabel = UILabel()
    
    let achievements: [Achievement] = [
        Achievement(id: 1, title: "Primeiro Passo", description: "Seguir seu primeiro animal", icon: "star.fill", isUnlocked: true),
        Achievement(id: 2, title: "Colecionador", description: "Seguir 5 animais", icon: "heart.circle.fill", isUnlocked: true),
        Achievement(id: 3, title: "Protetor", description: "Seguir 10 animais", icon: "shield.fill", isUnlocked: false),
        Achievement(id: 4, title: "Campeão", description: "Seguir 25 animais", icon: "crown.fill", isUnlocked: false),
        Achievement(id: 5, title: "Visitante", description: "Visitar a app 5 vezes", icon: "eye.fill", isUnlocked: true),
        Achievement(id: 6, title: "Explorador", description: "Visitar a app 20 vezes", icon: "map.fill", isUnlocked: false),
    ]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupCollectionView()
        setupConstraints()
    }
    
    private func setupUI() {
        title = "Conquistas"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
        
        emptyLabel.text = "Desbloqueie conquistas\nseguindo animais!"
        emptyLabel.textAlignment = .center
        emptyLabel.numberOfLines = 0
        emptyLabel.font = .systemFont(ofSize: 16, weight: .medium)
        emptyLabel.textColor = .secondaryLabel
        emptyLabel.isHidden = true
        emptyLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyLabel)
    }
    
    private func setupCollectionView() {
        collectionView.translatesAutoresizingMaskIntoConstraints = false
        collectionView.dataSource = self
        collectionView.delegate = self
        collectionView.backgroundColor = .systemBackground
        collectionView.register(AchievementCell.self, forCellWithReuseIdentifier: "AchievementCell")
        
        view.addSubview(collectionView)
    }
    
    private func setupConstraints() {
        NSLayoutConstraint.activate([
            collectionView.topAnchor.constraint(equalTo: view.topAnchor),
            collectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            collectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            collectionView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            emptyLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            emptyLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])
    }
}

// MARK: - CollectionView DataSource
extension AchievementsViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return achievements.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "AchievementCell", for: indexPath) as! AchievementCell
        let achievement = achievements[indexPath.row]
        cell.configure(with: achievement)
        return cell
    }
}

// MARK: - CollectionView Delegate
extension AchievementsViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let achievement = achievements[indexPath.row]
        showAchievementDetails(achievement)
    }
    
    private func showAchievementDetails(_ achievement: Achievement) {
        let alert = UIAlertController(title: achievement.title, message: achievement.description, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: achievement.isUnlocked ? "Conseguido!" : "Bloqueado", style: .default))
        present(alert, animated: true)
    }
}

// MARK: - Achievement Model
struct Achievement {
    let id: Int
    let title: String
    let description: String
    let icon: String
    let isUnlocked: Bool
}

// MARK: - Achievement Cell
class AchievementCell: UICollectionViewCell {
    
    private let containerView = UIView()
    private let iconView = UIImageView()
    private let titleLabel = UILabel()
    private let descriptionLabel = UILabel()
    private let lockImageView = UIImageView()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI() {
        containerView.translatesAutoresizingMaskIntoConstraints = false
        containerView.backgroundColor = .systemGray6
        containerView.layer.cornerRadius = 12
        containerView.clipsToBounds = true
        containerView.layer.borderWidth = 2
        containerView.layer.borderColor = UIColor.clear.cgColor
        
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        
        titleLabel.font = .systemFont(ofSize: 14, weight: .bold)
        titleLabel.textColor = .label
        titleLabel.textAlignment = .center
        titleLabel.numberOfLines = 1
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        descriptionLabel.font = .systemFont(ofSize: 11, weight: .regular)
        descriptionLabel.textColor = .secondaryLabel
        descriptionLabel.textAlignment = .center
        descriptionLabel.numberOfLines = 2
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        
        lockImageView.image = UIImage(systemName: "lock.fill")
        lockImageView.tintColor = .systemGray
        lockImageView.translatesAutoresizingMaskIntoConstraints = false
        
        containerView.addSubview(iconView)
        containerView.addSubview(titleLabel)
        containerView.addSubview(descriptionLabel)
        containerView.addSubview(lockImageView)
        contentView.addSubview(containerView)
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor),
            
            iconView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            iconView.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
            iconView.widthAnchor.constraint(equalToConstant: 50),
            iconView.heightAnchor.constraint(equalToConstant: 50),
            
            titleLabel.topAnchor.constraint(equalTo: iconView.bottomAnchor, constant: 8),
            titleLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 8),
            titleLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            
            descriptionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            descriptionLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 8),
            descriptionLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            descriptionLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -8),
            
            lockImageView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 8),
            lockImageView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            lockImageView.widthAnchor.constraint(equalToConstant: 20),
            lockImageView.heightAnchor.constraint(equalToConstant: 20)
        ])
    }
    
    func configure(with achievement: Achievement) {
        iconView.image = UIImage(systemName: achievement.icon)
        iconView.tintColor = achievement.isUnlocked ? .systemYellow : .systemGray3
        
        titleLabel.text = achievement.title
        descriptionLabel.text = achievement.description
        
        lockImageView.isHidden = achievement.isUnlocked
        
        containerView.backgroundColor = achievement.isUnlocked ? .systemGray6 : .systemGray5
        containerView.layer.borderColor = achievement.isUnlocked ? UIColor.systemYellow.cgColor : UIColor.clear.cgColor
        
        alpha = achievement.isUnlocked ? 1.0 : 0.6
    }
}
