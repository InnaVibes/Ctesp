import UIKit

class AchievementCell: UICollectionViewCell {
    
    private let containerView = UIView()
    private let iconView = UIImageView()
    private let titleLabel = UILabel()
    private let descriptionLabel = UILabel()
    private let progressLabel = UILabel()
    private let progressBar = UIProgressView(progressViewStyle: .default)
    private let lockImageView = UIImageView()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) not implemented")
    }
    
    private func setupUI() {
        containerView.translatesAutoresizingMaskIntoConstraints = false
        containerView.backgroundColor = .systemGray6
        containerView.layer.cornerRadius = UIConstants.largeCornerRadius
        containerView.clipsToBounds = true
        containerView.layer.borderWidth = 2
        containerView.layer.borderColor = UIColor.clear.cgColor
        
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        
        titleLabel.font = .systemFont(ofSize: 13, weight: .bold)
        titleLabel.textColor = .label
        titleLabel.textAlignment = .center
        titleLabel.numberOfLines = 1
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        descriptionLabel.font = .systemFont(ofSize: 10, weight: .regular)
        descriptionLabel.textColor = .secondaryLabel
        descriptionLabel.textAlignment = .center
        descriptionLabel.numberOfLines = 2
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        
        progressLabel.font = .systemFont(ofSize: 9, weight: .semibold)
        progressLabel.textColor = .systemBlue
        progressLabel.textAlignment = .center
        progressLabel.translatesAutoresizingMaskIntoConstraints = false
        
        progressBar.translatesAutoresizingMaskIntoConstraints = false
        progressBar.progressTintColor = .systemBlue
        progressBar.trackTintColor = .systemGray4
        
        lockImageView.image = UIImage(systemName: "lock.fill")
        lockImageView.tintColor = .systemGray
        lockImageView.translatesAutoresizingMaskIntoConstraints = false
        
        containerView.addSubview(iconView)
        containerView.addSubview(titleLabel)
        containerView.addSubview(descriptionLabel)
        containerView.addSubview(progressLabel)
        containerView.addSubview(progressBar)
        containerView.addSubview(lockImageView)
        contentView.addSubview(containerView)
        
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
    
    func configure(with achievement: Achievement) {
        iconView.image = UIImage(systemName: achievement.icon)
        iconView.tintColor = achievement.isUnlocked ? .systemYellow : .systemGray3
        
        titleLabel.text = achievement.title
        descriptionLabel.text = achievement.description
        progressLabel.text = achievement.progressText
        progressBar.progress = Float(achievement.progress)
        
        progressLabel.isHidden = achievement.isUnlocked
        progressBar.isHidden = achievement.isUnlocked
        
        lockImageView.isHidden = achievement.isUnlocked
        
        containerView.backgroundColor = achievement.isUnlocked ? .systemGray6 : .systemGray5
        containerView.layer.borderColor = achievement.isUnlocked 
            ? UIColor.systemYellow.cgColor 
            : UIColor.clear.cgColor
        
        alpha = achievement.isUnlocked ? 1.0 : 0.7
    }
}
