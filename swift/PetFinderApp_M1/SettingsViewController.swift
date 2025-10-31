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
        
        view.addSubview(tableView)
    }
}

extension SettingsViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }
    
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
        
        switch indexPath.section {
        case 0:
            if indexPath.row == 0 {
                cell.textLabel?.text = "Expiração de Cache (minutos)"
                let minutes = UserDefaults.standard.integer(forKey: "cacheExpirationMinutes")
                cell.detailTextLabel?.text = "\(minutes > 0 ? minutes : 60) min"
            } else {
                cell.textLabel?.text = "Animais por página"
                let items = UserDefaults.standard.integer(forKey: "itemsPerPage")
                cell.detailTextLabel?.text = "\(items > 0 ? items : 20)"
            }
        case 1:
            if indexPath.row == 0 {
                cell.textLabel?.text = "Notificações Diárias"
                let isEnabled = UserDefaults.standard.bool(forKey: "dailyNotificationsEnabled")
                cell.accessoryType = isEnabled ? .checkmark : .none
            } else {
                cell.textLabel?.text = "Hora Preferencial"
                let hour = UserDefaults.standard.integer(forKey: "notificationHour")
                cell.detailTextLabel?.text = String(format: "%02d:00", hour > 0 ? hour : 9)
            }
        case 2:
            cell.textLabel?.text = "Limpar Todos os Dados"
            cell.textLabel?.textColor = .systemRed
        default:
            break
        }
        
        return cell
    }
}

extension SettingsViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case 0: return "Cache"
        case 1: return "Notificações"
        case 2: return "Geral"
        default: return nil
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
}
