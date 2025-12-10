import UIKit

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
            
            iconView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: UIConstants.smallSpacing),
            iconView.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
            iconView.widthAnchor.constraint(equalToConstant: UIConstants.largeIconSize),
            iconView.heightAnchor.constraint(equalToConstant: UIConstants.largeIconSize),
            
            titleLabel.topAnchor.constraint(equalTo: iconView.bottomAnchor, constant: UIConstants.smallSpacing),
            titleLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: UIConstants.smallSpacing),
            titleLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -UIConstants.smallSpacing),
            
            descriptionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            descriptionLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: UIConstants.smallSpacing),
            descriptionLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -UIConstants.smallSpacing),
            descriptionLabel.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -UIConstants.smallSpacing),
            
            lockImageView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: UIConstants.smallSpacing),
            lockImageView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -UIConstants.smallSpacing),
            lockImageView.widthAnchor.constraint(equalToConstant: UIConstants.smallIconSize),
            lockImageView.heightAnchor.constraint(equalToConstant: UIConstants.smallIconSize)
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
