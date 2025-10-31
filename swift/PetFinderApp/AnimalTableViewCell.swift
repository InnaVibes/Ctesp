import UIKit

// MARK: - Animal Table View Cell
class AnimalTableViewCell: UITableViewCell {
    
    // MARK: - UI Components
    private let photoImageView = UIImageView()
    private let nameLabel = UILabel()
    private let speciesLabel = UILabel()
    private let breedLabel = UILabel()
    private let locationLabel = UILabel()
    private let followButton = UIButton()
    
    // MARK: - Init
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Setup UI
    private func setupUI() {
        // Photo Image View
        photoImageView.contentMode = .scaleAspectFill
        photoImageView.clipsToBounds = true
        photoImageView.layer.cornerRadius = 8
        photoImageView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(photoImageView)
        
        // Name Label
        nameLabel.font = UIFont.boldSystemFont(ofSize: 16)
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(nameLabel)
        
        // Species Label
        speciesLabel.font = UIFont.systemFont(ofSize: 14)
        speciesLabel.textColor = .secondaryLabel
        speciesLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(speciesLabel)
        
        // Breed Label
        breedLabel.font = UIFont.systemFont(ofSize: 12)
        breedLabel.textColor = .tertiaryLabel
        breedLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(breedLabel)
        
        // Location Label
        locationLabel.font = UIFont.systemFont(ofSize: 12)
        locationLabel.textColor = .tertiaryLabel
        locationLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(locationLabel)
        
        // Follow Button
        followButton.setTitle("❤️", for: .normal)
        followButton.titleLabel?.font = UIFont.systemFont(ofSize: 18)
        followButton.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(followButton)
        
        // Constraints
        NSLayoutConstraint.activate([
            // Photo
            photoImageView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 12),
            photoImageView.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 12),
            photoImageView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -12),
            photoImageView.widthAnchor.constraint(equalToConstant: 80),
            photoImageView.heightAnchor.constraint(equalToConstant: 80),
            
            // Name
            nameLabel.leadingAnchor.constraint(equalTo: photoImageView.trailingAnchor, constant: 12),
            nameLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 12),
            nameLabel.trailingAnchor.constraint(equalTo: followButton.leadingAnchor, constant: -8),
            
            // Species
            speciesLabel.leadingAnchor.constraint(equalTo: photoImageView.trailingAnchor, constant: 12),
            speciesLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            speciesLabel.trailingAnchor.constraint(equalTo: followButton.leadingAnchor, constant: -8),
            
            // Breed
            breedLabel.leadingAnchor.constraint(equalTo: photoImageView.trailingAnchor, constant: 12),
            breedLabel.topAnchor.constraint(equalTo: speciesLabel.bottomAnchor, constant: 2),
            breedLabel.trailingAnchor.constraint(equalTo: followButton.leadingAnchor, constant: -8),
            
            // Location
            locationLabel.leadingAnchor.constraint(equalTo: photoImageView.trailingAnchor, constant: 12),
            locationLabel.topAnchor.constraint(equalTo: breedLabel.bottomAnchor, constant: 2),
            locationLabel.trailingAnchor.constraint(equalTo: followButton.leadingAnchor, constant: -8),
            
            // Follow Button
            followButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -12),
            followButton.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            followButton.widthAnchor.constraint(equalToConstant: 40),
            followButton.heightAnchor.constraint(equalToConstant: 40)
        ])
    }
    
    // MARK: - Configure
    func configure(with animal: Animal) {
        nameLabel.text = animal.name
        speciesLabel.text = animal.species
        breedLabel.text = animal.breed
        
        if let location = animal.location {
            var locationText = ""
            if let city = location.city {
                locationText = city
            }
            if let state = location.state {
                locationText += ", \(state)"
            }
            locationLabel.text = locationText
        }
        
        // Carregar imagem
        if let photoURLs = animal.photoURLs, !photoURLs.isEmpty {
            if let url = URL(string: photoURLs[0]) {
                URLSession.shared.dataTask(with: url) { data, _, _ in
                    if let data = data {
                        DispatchQueue.main.async {
                            self.photoImageView.image = UIImage(data: data)
                        }
                    }
                }.resume()
            }
        } else {
            photoImageView.image = UIImage(systemName: "photo")
        }
    }
}
