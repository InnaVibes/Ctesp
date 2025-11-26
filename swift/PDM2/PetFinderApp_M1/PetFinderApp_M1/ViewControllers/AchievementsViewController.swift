import UIKit

/// Controlador que apresenta as conquistas do utilizador
/// Exibe conquistas desbloqueadas e bloqueadas com progresso real
class AchievementsViewController: UIViewController {
    
    // MARK: - Propriedades de Interface
    
    /// Vista de coleção para exibir conquistas em grelha
    private let collectionView: UICollectionView = {
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .vertical
        layout.minimumLineSpacing = 16
        layout.minimumInteritemSpacing = 16
        layout.sectionInset = UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16)
        
        // Calcular tamanho dos itens (2 por linha)
        let itemWidth = (UIScreen.main.bounds.width - 16 * 3) / 2
        layout.itemSize = CGSize(width: itemWidth, height: itemWidth + 20)
        
        return UICollectionView(frame: .zero, collectionViewLayout: layout)
    }()
    
    /// Cabeçalho com estatísticas gerais
    private let headerView = UIView()
    private let statsLabel = UILabel()
    
    // MARK: - Propriedades de Dados
    
    /// Lista de todas as conquistas (carregada dinamicamente)
    private var achievements: [Achievement] = []
    
    // MARK: - Ciclo de Vida
    
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
        // Recarregar sempre que aparecer para refletir mudanças
        loadAchievements()
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    // MARK: - Configuração da Interface
    
    /// Configura os elementos básicos da interface
    private func setupUI() {
        title = "Conquistas"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
        
        // Botão de reset (apenas para testes - remover em produção)
        #if DEBUG
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            title: "Reset",
            style: .plain,
            target: self,
            action: #selector(resetStats)
        )
        #endif
        
        // Configurar cabeçalho com estatísticas
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
    
    /// Configura a vista de coleção
    private func setupCollectionView() {
        collectionView.translatesAutoresizingMaskIntoConstraints = false
        collectionView.dataSource = self
        collectionView.delegate = self
        collectionView.backgroundColor = .systemBackground
        collectionView.register(AchievementCell.self, forCellWithReuseIdentifier: "AchievementCell")
        
        view.addSubview(collectionView)
    }
    
    /// Configura as restrições de layout
    private func setupConstraints() {
        NSLayoutConstraint.activate([
            // Cabeçalho no topo
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 8),
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            
            // Vista de coleção abaixo do cabeçalho
            collectionView.topAnchor.constraint(equalTo: headerView.bottomAnchor, constant: 8),
            collectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            collectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            collectionView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor)
        ])
    }
    
    /// Configura observador de notificações de novas conquistas
    private func setupNotificationObserver() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(achievementUnlocked),
            name: NSNotification.Name("AchievementUnlocked"),
            object: nil
        )
    }
    
    // MARK: - Gestão de Dados
    
    /// Carrega todas as conquistas do gestor
    private func loadAchievements() {
        achievements = AchievementsManager.shared.getAllAchievements()
        updateStatsLabel()
        collectionView.reloadData()
    }
    
    /// Atualiza as estatísticas no cabeçalho
    private func updateStatsLabel() {
        let stats = AchievementsManager.shared.getUserStats()
        let unlockedCount = achievements.filter { $0.isUnlocked }.count
        let totalCount = achievements.count
        let followingCount = CoreDataManager.shared.getFollowingCount()
        
        statsLabel.text = """
        🏆 Conquistas: \(unlockedCount)/\(totalCount) desbloqueadas
        ❤️ Seguindo: \(followingCount) animais
        📱 Aberturas: \(stats.appOpenCount) vezes
        👀 Visualizações: \(stats.totalAnimalsViewed) animais
        """
    }
    
    // MARK: - Acções
    
    /// Chamado quando uma nova conquista é desbloqueada
    @objc private func achievementUnlocked(_ notification: Notification) {
        // Recarregar dados e mostrar animação
        loadAchievements()
        
        // Mostrar banner de celebração
        if let achievement = notification.userInfo?["achievement"] as? Achievement {
            showCelebrationBanner(for: achievement)
        }
    }
    
    /// Mostra banner de celebração para conquista desbloqueada
    private func showCelebrationBanner(for achievement: Achievement) {
        let alert = UIAlertController(
            title: "🎉 Conquista Desbloqueada!",
            message: "\(achievement.title)\n\(achievement.description)",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "Fantástico!", style: .default))
        present(alert, animated: true)
    }
    
    /// Reset de estatísticas (apenas para testes)
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

// MARK: - Data Source da Vista de Coleção

extension AchievementsViewController: UICollectionViewDataSource {
    
    /// Número de conquistas a exibir
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return achievements.count
    }
    
    /// Configura cada célula com dados de uma conquista
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "AchievementCell", for: indexPath) as! AchievementCell
        let achievement = achievements[indexPath.row]
        cell.configure(with: achievement)
        return cell
    }
}

// MARK: - Delegate da Vista de Coleção

extension AchievementsViewController: UICollectionViewDelegate {
    
    /// Mostra detalhes quando uma conquista é selecionada
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let achievement = achievements[indexPath.row]
        showAchievementDetails(achievement)
    }
    
    /// Apresenta um alerta com detalhes da conquista
    /// - Parameter achievement: Conquista a exibir
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

// MARK: - Célula de Conquista Atualizada

/// Célula personalizada para exibir uma conquista com progresso
class AchievementCell: UICollectionViewCell {
    
    // MARK: - Elementos de Interface
    
    private let containerView = UIView()
    private let iconView = UIImageView()
    private let titleLabel = UILabel()
    private let descriptionLabel = UILabel()
    private let progressLabel = UILabel()
    private let progressBar = UIProgressView(progressViewStyle: .default)
    private let lockImageView = UIImageView()
    
    // MARK: - Inicialização
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) não foi implementado")
    }
    
    // MARK: - Configuração da Interface
    
    private func setupUI() {
        // Vista contentor
        containerView.translatesAutoresizingMaskIntoConstraints = false
        containerView.backgroundColor = .systemGray6
        containerView.layer.cornerRadius = 12
        containerView.clipsToBounds = true
        containerView.layer.borderWidth = 2
        containerView.layer.borderColor = UIColor.clear.cgColor
        
        // Ícone da conquista
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        
        // Título
        titleLabel.font = .systemFont(ofSize: 13, weight: .bold)
        titleLabel.textColor = .label
        titleLabel.textAlignment = .center
        titleLabel.numberOfLines = 1
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Descrição
        descriptionLabel.font = .systemFont(ofSize: 10, weight: .regular)
        descriptionLabel.textColor = .secondaryLabel
        descriptionLabel.textAlignment = .center
        descriptionLabel.numberOfLines = 2
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Progresso
        progressLabel.font = .systemFont(ofSize: 9, weight: .semibold)
        progressLabel.textColor = .systemBlue
        progressLabel.textAlignment = .center
        progressLabel.translatesAutoresizingMaskIntoConstraints = false
        
        progressBar.translatesAutoresizingMaskIntoConstraints = false
        progressBar.progressTintColor = .systemBlue
        progressBar.trackTintColor = .systemGray4
        
        // Cadeado
        lockImageView.image = UIImage(systemName: "lock.fill")
        lockImageView.tintColor = .systemGray
        lockImageView.translatesAutoresizingMaskIntoConstraints = false
        
        // Adicionar elementos
        containerView.addSubview(iconView)
        containerView.addSubview(titleLabel)
        containerView.addSubview(descriptionLabel)
        containerView.addSubview(progressLabel)
        containerView.addSubview(progressBar)
        containerView.addSubview(lockImageView)
        contentView.addSubview(containerView)
        
        // Restrições
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: contentView.topAnchor),
            containerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            containerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            containerView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor),
            
            iconView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 12),
            iconView.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
            iconView.widthAnchor.constraint(equalToConstant: 40),
            iconView.heightAnchor.constraint(equalToConstant: 40),
            
            titleLabel.topAnchor.constraint(equalTo: iconView.bottomAnchor, constant: 6),
            titleLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 6),
            titleLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -6),
            
            descriptionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 3),
            descriptionLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 6),
            descriptionLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -6),
            
            progressLabel.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 4),
            progressLabel.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
            
            progressBar.topAnchor.constraint(equalTo: progressLabel.bottomAnchor, constant: 4),
            progressBar.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 12),
            progressBar.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -12),
            progressBar.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -8),
            
            lockImageView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 8),
            lockImageView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -8),
            lockImageView.widthAnchor.constraint(equalToConstant: 16),
            lockImageView.heightAnchor.constraint(equalToConstant: 16)
        ])
    }
    
    // MARK: - Configuração
    
    func configure(with achievement: Achievement) {
        iconView.image = UIImage(systemName: achievement.icon)
        iconView.tintColor = achievement.isUnlocked ? .systemYellow : .systemGray3
        
        titleLabel.text = achievement.title
        descriptionLabel.text = achievement.description
        progressLabel.text = achievement.progressText
        progressBar.progress = Float(achievement.progress)
        
        // Ocultar progresso se já desbloqueado
        progressLabel.isHidden = achievement.isUnlocked
        progressBar.isHidden = achievement.isUnlocked
        
        // Mostrar/ocultar cadeado
        lockImageView.isHidden = achievement.isUnlocked
        
        // Aparência conforme estado
        containerView.backgroundColor = achievement.isUnlocked ? .systemGray6 : .systemGray5
        containerView.layer.borderColor = achievement.isUnlocked 
            ? UIColor.systemYellow.cgColor 
            : UIColor.clear.cgColor
        
        alpha = achievement.isUnlocked ? 1.0 : 0.7
    }
}