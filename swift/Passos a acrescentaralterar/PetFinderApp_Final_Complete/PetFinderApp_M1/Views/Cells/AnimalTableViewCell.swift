import UIKit

protocol AnimalTableViewCellDelegate: AnyObject {
    func animalCellDidTapFavorite(_ cell: AnimalTableViewCell, animalId: Int64)
}

class AnimalTableViewCell: UITableViewCell {
    
    weak var delegate: AnimalTableViewCellDelegate?
    private var animalId: Int64?
    
    private let animalImageView = UIImageView()
    private let nameLabel = UILabel()
    private let speciesLabel = UILabel()
    private let detailsLabel = UILabel()
    private let followButton = UIButton(type: .system)
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) not implemented")
    }
    
    private func setupUI() {
        animalImageView.contentMode = .scaleAspectFill
        animalImageView.clipsToBounds = true
        animalImageView.layer.cornerRadius = UIConstants.cornerRadius
        animalImageView.backgroundColor = .systemGray5
        animalImageView.translatesAutoresizingMaskIntoConstraints = false
        
        nameLabel.font = .systemFont(ofSize: 18, weight: .bold)
        nameLabel.textColor = .label
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        
        speciesLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        speciesLabel.textColor = .systemBlue
        speciesLabel.translatesAutoresizingMaskIntoConstraints = false
        
        detailsLabel.font = .systemFont(ofSize: 13, weight: .regular)
        detailsLabel.textColor = .secondaryLabel
        detailsLabel.numberOfLines = 2
        detailsLabel.translatesAutoresizingMaskIntoConstraints = false
        
        followButton.setImage(UIImage(systemName: "heart"), for: .normal)
        followButton.translatesAutoresizingMaskIntoConstraints = false
        followButton.addTarget(self, action: #selector(favoriteTapped), for: .touchUpInside)
        
        contentView.addSubview(animalImageView)
        contentView.addSubview(nameLabel)
        contentView.addSubview(speciesLabel)
        contentView.addSubview(detailsLabel)
        contentView.addSubview(followButton)
        
        NSLayoutConstraint.activate([
            animalImageView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: UIConstants.mediumSpacing),
            animalImageView.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            animalImageView.widthAnchor.constraint(equalToConstant: 80),
            animalImageView.heightAnchor.constraint(equalToConstant: 80),
            
            nameLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: UIConstants.smallSpacing),
            nameLabel.leadingAnchor.constraint(equalTo: animalImageView.trailingAnchor, constant: UIConstants.mediumSpacing),
            nameLabel.trailingAnchor.constraint(equalTo: followButton.leadingAnchor, constant: -UIConstants.smallSpacing),
            
            speciesLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            speciesLabel.leadingAnchor.constraint(equalTo: animalImageView.trailingAnchor, constant: UIConstants.mediumSpacing),
            
            detailsLabel.topAnchor.constraint(equalTo: speciesLabel.bottomAnchor, constant: 6),
            detailsLabel.leadingAnchor.constraint(equalTo: animalImageView.trailingAnchor, constant: UIConstants.mediumSpacing),
            detailsLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -UIConstants.mediumSpacing),
            detailsLabel.bottomAnchor.constraint(lessThanOrEqualTo: contentView.bottomAnchor, constant: -UIConstants.smallSpacing),
            
            followButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -UIConstants.mediumSpacing),
            followButton.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            followButton.widthAnchor.constraint(equalToConstant: 40),
            followButton.heightAnchor.constraint(equalToConstant: 40)
        ])
    }
    
    @objc private func favoriteTapped() {
        guard let id = animalId else { return }
        delegate?.animalCellDidTapFavorite(self, animalId: id)
    }
    
    func configure(with pet: PetUnifiedModel, isFollowing: Bool) {
        guard let petIdInt = Int64(pet.id) else { return }
        self.animalId = petIdInt
        
        nameLabel.text = pet.name
        speciesLabel.text = pet.formattedSpecies
        
        var details = pet.formattedBreed
        details += " • \(pet.formattedGender)"
        details += " • \(pet.formattedAge)"
        
        detailsLabel.text = details
        
        let heartImage = isFollowing ? "heart.fill" : "heart"
        let heartColor: UIColor = isFollowing ? .systemRed : .systemGray
        followButton.setImage(UIImage(systemName: heartImage), for: .normal)
        followButton.tintColor = heartColor
        
        if let photoURLString = pet.photoURL, let photoURL = URL(string: photoURLString) {
            loadImage(from: photoURL)
        } else {
            animalImageView.image = UIImage(systemName: "photo")
            animalImageView.tintColor = .systemGray3
        }
    }
    
    private func loadImage(from url: URL) {
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            guard let data = data, let image = UIImage(data: data) else { return }
            DispatchQueue.main.async {
                self?.animalImageView.image = image
            }
        }.resume()
    }
    
    override func prepareForReuse() {
        super.prepareForReuse()
        animalImageView.image = nil
        animalId = nil
    }
}
