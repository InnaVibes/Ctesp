import UIKit

class SettingsViewController: UIViewController {
    
    private let tableView = UITableView(frame: .zero, style: .grouped)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupTableView()
    }
    
    private func setupUI() {
        title = "Definições"
        view.backgroundColor = .systemBackground
        navigationController?.navigationBar.prefersLargeTitles = true
    }
    
    private func setupTableView() {
        tableView.frame = view.bounds
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "SettingCell")
        tableView.backgroundColor = .systemBackground
        view.addSubview(tableView)
    }
}

extension SettingsViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int { return 3 }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0: return 2
        case 1: return 2
        case 2: return 1
        default: return 0
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "SettingCell", for: indexPath)
        cell.textLabel?.text = ""
        cell.detailTextLabel?.text = ""
        cell.accessoryType = .none
        cell.textLabel?.textColor = .label
        
        switch indexPath.section {
        case 0:
            if indexPath.row == 0 {
                cell.textLabel?.text = "Expiração de Cache"
                cell.accessoryType = .disclosureIndicator
            } else {
                cell.textLabel?.text = "Animais por página"
                cell.accessoryType = .disclosureIndicator
            }
        case 1:
            if indexPath.row == 0 {
                cell.textLabel?.text = "Notificações Diárias"
            } else {
                cell.textLabel?.text = "Hora Preferencial"
                cell.accessoryType = .disclosureIndicator
            }
        case 2:
            cell.textLabel?.text = "Limpar Todos os Dados"
            cell.textLabel?.textColor = .systemRed
        default: break
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case 0: return "Cache"
        case 1: return "Notificações"
        case 2: return "Geral"
        default: return nil
        }
    }
}

extension SettingsViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        if indexPath.section == 2 && indexPath.row == 0 {
            let alert = UIAlertController(title: "Limpar Dados", message: "Tem certeza?", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
            alert.addAction(UIAlertAction(title: "Limpar", style: .destructive) { _ in
                CoreDataManager.shared.deleteAllAnimals()
                let successAlert = UIAlertController(title: "Sucesso", message: "Dados eliminados.", preferredStyle: .alert)
                successAlert.addAction(UIAlertAction(title: "OK", style: .default))
                self.present(successAlert, animated: true)
            })
            present(alert, animated: true)
        }
    }
}
