import UIKit

class AchievementsViewController: UIViewController {
    
    private let collectionView: UICollectionView = {
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .vertical
        layout.minimumLineSpacing = 16
        layout.minimumInteritemSpacing = 16
        layout.sectionInset = UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16)
        
        let itemWidth = (UIScreen.main.bounds.width - 16 * 3) / 2
        layout.itemSize = CGSize(width: itemWidth, height: itemWidth + 20)
        
        return UICollectionView(frame: .zero, collectionViewLayout: layout)
    }()
    
    private let headerView = UIView()
    private let statsLabel = UILabel()
    private var achievements: [Achievement] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupCollectionView()
        setupConstraints()
        setupNotificationObserver()
        loadAchievements()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        loadAchievements()
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    private func setupUI() {
        title = "Conquistas"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
        
        #if DEBUG
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            title: "Reset",
            style: .plain,
            target: self,
            action: #selector(resetStats)
        )
        #endif
        
        headerView.backgroundColor = .systemGray6
        headerView.layer.cornerRadius = 12
        headerView.translatesAutoresizingMaskIntoConstraints = false
        
        statsLabel.numberOfLines = 0
        statsLabel.font = .systemFont(ofSize: 14, weight: .medium)
        statsLabel.textColor = .secondaryLabel
        statsLabel.textAlignment = .center
        statsLabel.translatesAutoresizingMaskIntoConstraints = false
        
        headerView.addSubview(statsLabel)
        view.addSubview(headerView)
        
        NSLayoutConstraint.activate([
            statsLabel.topAnchor.constraint(equalTo: headerView.topAnchor, constant: 12),
            statsLabel.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 16),
            statsLabel.trailingAnchor.constraint(equalTo: headerView.trailingAnchor, constant: -16),
            statsLabel.bottomAnchor.constraint(equalTo: headerView.bottomAnchor, constant: -12)
        ])
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
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 8),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            
            collectionView.topAnchor.constraint(equalTo: headerView.bottomAnchor, constant: 8),
            collectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            collectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            collectionView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor)
        ])
    }
    
    private func setupNotificationObserver() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(achievementUnlocked),
            name: NSNotification.Name("AchievementUnlocked"),
            object: nil
        )
    }
    
    private func loadAchievements() {
        achievements = AchievementsManager.shared.getAllAchievements()
        updateStatsLabel()
        collectionView.reloadData()
    }
    
    private func updateStatsLabel() {
        let stats = AchievementsManager.shared.getUserStats()
        let unlockedCount = achievements.filter { $0.isUnlocked }.count
        let totalCount = achievements.count
        let followingCount = CoreDataManager.shared.getFollowingCount()
        
        statsLabel.text = """
        🏆 Conquistas: \(unlockedCount)/\(totalCount) desbloqueadas
        ❤️ Seguindo: \(followingCount) animais
        📱 Aberturas: \(stats.appOpenCount) vezes
        """
    }
    
    @objc private func achievementUnlocked(_ notification: Notification) {
        loadAchievements()
        
        if let achievement = notification.userInfo?["achievement"] as? Achievement {
            showCelebrationBanner(for: achievement)
        }
    }
    
    private func showCelebrationBanner(for achievement: Achievement) {
        let alert = UIAlertController(
            title: "🎉 Conquista Desbloqueada!",
            message: "\(achievement.title)\n\(achievement.description)",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "Fantástico!", style: .default))
        present(alert, animated: true)
    }
    
    @objc private func resetStats() {
        let alert = UIAlertController(
            title: "Reset de Estatísticas",
            message: "Deseja resetar todas as estatísticas e conquistas?",
            preferredStyle: .alert
        )
        
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        alert.addAction(UIAlertAction(title: "Resetar", style: .destructive) { _ in
            AchievementsManager.shared.resetAllStats()
            self.loadAchievements()
        })
        
        present(alert, animated: true)
    }
}

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

extension AchievementsViewController: UICollectionViewDelegate {
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let achievement = achievements[indexPath.row]
        showAchievementDetails(achievement)
    }
    
    private func showAchievementDetails(_ achievement: Achievement) {
        let statusMessage = achievement.isUnlocked
            ? "✅ Conquista desbloqueada!"
            : "🔒 Progresso: \(achievement.progressText)"
        
        let alert = UIAlertController(
            title: achievement.title,
            message: "\(achievement.description)\n\n\(statusMessage)",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
