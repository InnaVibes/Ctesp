import UIKit

/// Protocolo para comunicar ações da célula
protocol AnimalTableViewCellDelegate: AnyObject {
    func animalCellDidTapFavorite(_ cell: AnimalTableViewCell, animal: AnimalEntity)
}

/// Célula personalizada para exibir um animal na lista
class AnimalTableViewCell: UITableViewCell {
    
    // MARK: - Propriedades
    
    weak var delegate: AnimalTableViewCellDelegate?
    private var animal: AnimalEntity?
    
    // MARK: - Elementos de Interface
    
    private let nameLabel = UILabel()
    private let speciesLabel = UILabel()
    private let detailsLabel = UILabel()
    private let followButton = UIButton(type: .system)
    
    // MARK: - Inicialização
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) não foi implementado")
    }
    
    // MARK: - Configuração da Interface
    
    private func setupUI() {
        // Nome
        nameLabel.font = .systemFont(ofSize: 18, weight: .bold)
        nameLabel.textColor = .label
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Espécie
        speciesLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        speciesLabel.textColor = .systemBlue
        speciesLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Detalhes
        detailsLabel.font = .systemFont(ofSize: 13, weight: .regular)
        detailsLabel.textColor = .secondaryLabel
        detailsLabel.numberOfLines = 2
        detailsLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // Botão de seguir
        followButton.setImage(UIImage(systemName: "heart"), for: .normal)
        followButton.translatesAutoresizingMaskIntoConstraints = false
        followButton.addTarget(self, action: #selector(favoriteTapped), for: .touchUpInside)
        
        // Adicionar elementos
        contentView.addSubview(nameLabel)
        contentView.addSubview(speciesLabel)
        contentView.addSubview(detailsLabel)
        contentView.addSubview(followButton)
        
        // Constraints
        NSLayoutConstraint.activate([
            nameLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: UIConstants.smallSpacing),
            nameLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: UIConstants.mediumSpacing),
            nameLabel.trailingAnchor.constraint(equalTo: followButton.leadingAnchor, constant: -UIConstants.smallSpacing),
            
            speciesLabel.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 4),
            speciesLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: UIConstants.mediumSpacing),
            
            detailsLabel.topAnchor.constraint(equalTo: speciesLabel.bottomAnchor, constant: 6),
            detailsLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: UIConstants.mediumSpacing),
            detailsLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -UIConstants.mediumSpacing),
            detailsLabel.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -UIConstants.smallSpacing),
            
            followButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -UIConstants.mediumSpacing),
            followButton.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            followButton.widthAnchor.constraint(equalToConstant: 40),
            followButton.heightAnchor.constraint(equalToConstant: 40)
        ])
    }
    
    // MARK: - Ações
    
    @objc private func favoriteTapped() {
        guard let animal = animal else { return }
        delegate?.animalCellDidTapFavorite(self, animal: animal)
    }
    
    // MARK: - Configuração
    
    func configure(with animal: AnimalEntity) {
        self.animal = animal
        
        nameLabel.text = animal.name ?? "Sem nome"
        speciesLabel.text = animal.species ?? "-"
        
        var details = ""
        if let breed = animal.breed, !breed.isEmpty {
            details += "Raça: \(breed)"
        }
        if let gender = animal.gender, !gender.isEmpty {
            details += details.isEmpty ? "" : " • "
            details += "Género: \(gender)"
        }
        
        detailsLabel.text = details.isEmpty ? "Sem detalhes" : details
        
        let heartImage = animal.isFollowing ? "heart.fill" : "heart"
        let heartColor: UIColor = animal.isFollowing ? .systemRed : .systemGray
        followButton.setImage(UIImage(systemName: heartImage), for: .normal)
        followButton.tintColor = heartColor
    }
}
