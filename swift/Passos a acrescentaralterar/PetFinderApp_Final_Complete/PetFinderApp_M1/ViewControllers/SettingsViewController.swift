import UIKit

class SettingsViewController: UIViewController {
    
    private let tableView = UITableView(frame: .zero, style: .insetGrouped)
    
    private enum SettingSection: Int, CaseIterable {
        case api
        case cache
        case about
        
        var title: String {
            switch self {
            case .api: return "API"
            case .cache: return "Cache"
            case .about: return "Sobre"
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        title = "Definições"
        view.backgroundColor = .systemBackground
        
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
        tableView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(tableView)
        
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func configureAPISettings() {
        let alert = UIAlertController(title: "Configurar API", message: "Configure suas credenciais do Adopt-a-Pet", preferredStyle: .alert)
        
        alert.addTextField { textField in
            textField.placeholder = "API Key"
            textField.text = UserDefaults.standard.string(forKey: UserDefaultsKeys.apiKey)
        }
        
        alert.addTextField { textField in
            textField.placeholder = "Shelter ID"
            textField.text = UserDefaults.standard.string(forKey: UserDefaultsKeys.shelterId)
        }
        
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        alert.addAction(UIAlertAction(title: "Guardar", style: .default) { _ in
            let apiKey = alert.textFields?[0].text ?? ""
            let shelterId = alert.textFields?[1].text ?? ""
            
            UserDefaults.standard.set(apiKey, forKey: UserDefaultsKeys.apiKey)
            UserDefaults.standard.set(shelterId, forKey: UserDefaultsKeys.shelterId)
            
            AlertHelper.showSuccess(on: self, message: "Credenciais guardadas com sucesso")
        })
        
        present(alert, animated: true)
    }
    
    private func clearCache() {
        AlertHelper.showConfirmation(
            on: self,
            title: "Limpar Cache",
            message: "Tem certeza que deseja limpar o cache?",
            confirmTitle: "Limpar",
            confirmStyle: .destructive
        ) {
            NetworkManager.shared.clearCache()
            AlertHelper.showSuccess(on: self, message: "Cache limpo com sucesso")
        }
    }
}

// MARK: - UITableViewDataSource
extension SettingsViewController: UITableViewDataSource {
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return SettingSection.allCases.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        guard let settingSection = SettingSection(rawValue: section) else { return 0 }
        
        switch settingSection {
        case .api: return 1
        case .cache: return 1
        case .about: return 1
        }
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return SettingSection(rawValue: section)?.title
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        cell.accessoryType = .disclosureIndicator
        
        guard let settingSection = SettingSection(rawValue: indexPath.section) else { return cell }
        
        switch settingSection {
        case .api:
            cell.textLabel?.text = "Configurar API"
        case .cache:
            cell.textLabel?.text = "Limpar Cache"
        case .about:
            cell.textLabel?.text = "Versão"
            cell.detailTextLabel?.text = "1.0"
            cell.accessoryType = .none
        }
        
        return cell
    }
}

// MARK: - UITableViewDelegate
extension SettingsViewController: UITableViewDelegate {
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        guard let settingSection = SettingSection(rawValue: indexPath.section) else { return }
        
        switch settingSection {
        case .api:
            configureAPISettings()
        case .cache:
            clearCache()
        case .about:
            break
        }
    }
}
