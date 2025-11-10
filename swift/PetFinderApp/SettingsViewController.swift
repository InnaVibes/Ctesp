import UIKit

// MARK: - Settings View Controller
class SettingsViewController: UIViewController {
    
    // MARK: - Properties
    private let tableView = UITableView(frame: .zero, style: .grouped)
    
    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupTableView()
    }
    
    // MARK: - Setup UI
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
        tableView.register(SwitchTableViewCell.self, forCellReuseIdentifier: "SwitchCell")
        
        view.addSubview(tableView)
    }
}

// MARK: - UITableViewDataSource
extension SettingsViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 3 // Cache, Notificações, Geral
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0: return 2 // Cache expiration, Items per page
        case 1: return 2 // Enable notifications, Notification time
        case 2: return 1 // Clear all data
        default: return 0
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        switch indexPath.section {
        case 0: // Cache
            return configureCacheCell(at: indexPath)
        case 1: // Notifications
            return configureNotificationCell(at: indexPath)
        case 2: // General
            let cell = tableView.dequeueReusableCell(withIdentifier: "SettingCell", for: indexPath)
            cell.textLabel?.text = "Limpar Todos os Dados"
            cell.textLabel?.textColor = .systemRed
            return cell
        default:
            return UITableViewCell()
        }
    }
    
    private func configureCacheCell(at indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "SettingCell", for: indexPath)
        
        if indexPath.row == 0 {
            cell.textLabel?.text = "Expiração de Cache (minutos)"
            let cacheExpiration = UserDefaults.standard.integer(forKey: "cacheExpirationMinutes")
            let minutes = cacheExpiration > 0 ? cacheExpiration : 60
            cell.detailTextLabel?.text = "\(minutes) min"
        } else {
            cell.textLabel?.text = "Animais por página"
            let itemsPerPage = UserDefaults.standard.integer(forKey: "itemsPerPage")
            let items = itemsPerPage > 0 ? itemsPerPage : 20
            cell.detailTextLabel?.text = "\(items)"
        }
        
        return cell
    }
    
    private func configureNotificationCell(at indexPath: IndexPath) -> UITableViewCell {
        if indexPath.row == 0 {
            let cell = tableView.dequeueReusableCell(withIdentifier: "SwitchCell", for: indexPath) as! SwitchTableViewCell
            cell.textLabel?.text = "Notificações Diárias"
            let isEnabled = UserDefaults.standard.bool(forKey: "dailyNotificationsEnabled")
            cell.setSwitch(isOn: isEnabled, target: self, action: #selector(toggleNotifications(_:)))
            return cell
        } else {
            let cell = tableView.dequeueReusableCell(withIdentifier: "SettingCell", for: indexPath)
            cell.textLabel?.text = "Hora Preferencial"
            let hour = UserDefaults.standard.integer(forKey: "notificationHour")
            let displayHour = hour > 0 ? hour : 9
            cell.detailTextLabel?.text = String(format: "%02d:00", displayHour)
            return cell
        }
    }
}

// MARK: - UITableViewDelegate
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
        
        if indexPath.section == 0 && indexPath.row == 0 {
            showCacheExpirationPicker()
        } else if indexPath.section == 0 && indexPath.row == 1 {
            showItemsPerPagePicker()
        } else if indexPath.section == 1 && indexPath.row == 1 {
            showTimePicker()
        } else if indexPath.section == 2 && indexPath.row == 0 {
            clearAllData()
        }
    }
    
    // MARK: - Actions
    @objc private func toggleNotifications(_ sender: UISwitch) {
        UserDefaults.standard.set(sender.isOn, forKey: "dailyNotificationsEnabled")
        
        if sender.isOn {
            let hour = UserDefaults.standard.integer(forKey: "notificationHour")
            let displayHour = hour > 0 ? hour : 9
            NotificationService.shared.scheduleDailyAnimalNotification(at: displayHour)
        } else {
            NotificationService.shared.cancelNotification(identifier: "dailyAnimal")
        }
    }
    
    private func showCacheExpirationPicker() {
        let alert = UIAlertController(title: "Expiração de Cache", message: "Selecione em minutos", preferredStyle: .alert)
        alert.addTextField { textField in
            let currentValue = UserDefaults.standard.integer(forKey: "cacheExpirationMinutes")
            textField.text = String(currentValue > 0 ? currentValue : 60)
            textField.keyboardType = .numberPad
        }
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            if let text = alert.textFields?.first?.text, let minutes = Int(text) {
                UserDefaults.standard.set(minutes, forKey: "cacheExpirationMinutes")
                CacheService.shared.setCacheExpirationTime(TimeInterval(minutes * 60))
                self.tableView.reloadData()
            }
        })
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        present(alert, animated: true)
    }
    
    private func showItemsPerPagePicker() {
        let alert = UIAlertController(title: "Animais por Página", message: nil, preferredStyle: .actionSheet)
        [10, 20, 30, 50].forEach { count in
            alert.addAction(UIAlertAction(title: String(count), style: .default) { _ in
                UserDefaults.standard.set(count, forKey: "itemsPerPage")
                self.tableView.reloadData()
            })
        }
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        present(alert, animated: true)
    }
    
    private func showTimePicker() {
        let alert = UIAlertController(title: "Hora Preferencial", message: nil, preferredStyle: .alert)
        alert.addTextField { textField in
            let currentHour = UserDefaults.standard.integer(forKey: "notificationHour")
            textField.text = String(currentHour > 0 ? currentHour : 9)
            textField.keyboardType = .numberPad
            textField.placeholder = "0-23"
        }
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            if let text = alert.textFields?.first?.text, let hour = Int(text), hour >= 0, hour <= 23 {
                UserDefaults.standard.set(hour, forKey: "notificationHour")
                
                if UserDefaults.standard.bool(forKey: "dailyNotificationsEnabled") {
                    NotificationService.shared.scheduleDailyAnimalNotification(at: hour)
                }
                
                self.tableView.reloadData()
            }
        })
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        present(alert, animated: true)
    }
    
    private func clearAllData() {
        let alert = UIAlertController(title: "Limpar Dados", message: "Tem a certeza?", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Limpar", style: .destructive) { _ in
            CoreDataManager.shared.clearAllData()
            CacheService.shared.cleanExpiredCache()
            NotificationService.shared.cancelAllNotifications()
        })
        alert.addAction(UIAlertAction(title: "Cancelar", style: .cancel))
        present(alert, animated: true)
    }
}

// MARK: - Switch Table View Cell
class SwitchTableViewCell: UITableViewCell {
    private let switchControl = UISwitch()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        switchControl.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(switchControl)
        
        NSLayoutConstraint.activate([
            switchControl.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            switchControl.centerYAnchor.constraint(equalTo: contentView.centerYAnchor)
        ])
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func setSwitch(isOn: Bool, target: Any?, action: Selector) {
        switchControl.isOn = isOn
        switchControl.addTarget(target, action: action, for: .valueChanged)
    }
}
