import CoreData
import UIKit

/// Gestor centralizado para todas as operações de Core Data
/// Implementa o padrão Singleton para garantir uma única instância
class CoreDataManager {
    
    // MARK: - Singleton
    
    /// Instância partilhada do gestor
    static let shared = CoreDataManager()
    
    /// Inicializador privado para prevenir criação de múltiplas instâncias
    private init() {}
    
    // MARK: - Propriedades
    
    /// Contexto de objectos geridos obtido do AppDelegate
    var context: NSManagedObjectContext {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            fatalError("Não foi possível aceder ao AppDelegate")
        }
        return appDelegate.managedObjectContext
    }
    
    // MARK: - Operações de Leitura
    
    /// Obtém todos os animais da base de dados
    /// - Returns: Array de AnimalEntity ordenado por data de criação (mais recente primeiro)
    func fetchAllAnimals() -> [AnimalEntity] {
        let request: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(key: "savedDate", ascending: false)]
        
        do {
            return try context.fetch(request)
        } catch {
            print("Erro ao obter animais: \(error)")
            return []
        }
    }
    
    /// Obtém apenas os animais que o utilizador está a seguir
    /// - Returns: Array de AnimalEntity que estão marcados como seguidos
    func fetchFollowingAnimals() -> [AnimalEntity] {
        let request: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        request.predicate = NSPredicate(format: "isFollowing == %@", NSNumber(value: true))
        request.sortDescriptors = [NSSortDescriptor(key: "savedDate", ascending: false)]
        
        do {
            return try context.fetch(request)
        } catch {
            print("Erro ao obter animais seguidos: \(error)")
            return []
        }
    }
    
    /// Procura um animal específico pelo seu ID
    /// - Parameter id: ID único do animal
    /// - Returns: AnimalEntity se encontrado, nil caso contrário
    func fetchAnimal(byId id: Int64) -> AnimalEntity? {
        let request: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        request.predicate = NSPredicate(format: "id == %lld", id)
        request.fetchLimit = 1
        
        do {
            let results = try context.fetch(request)
            return results.first
        } catch {
            print("Erro ao obter animal por ID: \(error)")
            return nil
        }
    }
    
    // MARK: - Operações de Criação
    
    /// Guarda um novo animal na base de dados
    /// Se o animal já existir (mesmo ID), retorna o existente
    /// - Parameters:
    ///   - id: Identificador único do animal
    ///   - name: Nome do animal
    ///   - species: Espécie (ex: Cão, Gato)
    ///   - breed: Raça do animal
    ///   - gender: Género do animal
    ///   - age: Idade do animal
    ///   - descriptionText: Descrição detalhada do animal
    ///   - photoURLs: URLs de fotografias (opcional)
    ///   - location: Localização onde o animal se encontra
    /// - Returns: AnimalEntity criado ou existente
    func saveAnimal(id: Int64, name: String, species: String, breed: String, 
                   gender: String, age: String, descriptionText: String?, 
                   photoURLs: String?, location: String?) -> AnimalEntity? {
        
        // Verificar se o animal já existe
        if let existingAnimal = fetchAnimal(byId: id) {
            return existingAnimal
        }
        
        // Criar novo animal
        let animal = AnimalEntity(context: context)
        animal.id = id
        animal.name = name
        animal.species = species
        animal.breed = breed
        animal.gender = gender
        animal.age = age
        animal.descriptionText = descriptionText
        animal.photoURLs = photoURLs
        animal.location = location
        animal.isFollowing = false
        animal.savedDate = Date()
        
        saveContext()
        return animal
    }
    
    // MARK: - Operações de Actualização
    
    /// Alterna o estado de "seguir" de um animal
    /// - Parameter animal: Animal a actualizar
    func toggleFollowing(for animal: AnimalEntity) {
        animal.isFollowing.toggle()
        saveContext()
    }
    
    /// Guarda alterações feitas a um animal
    /// - Parameter animal: Animal a actualizar
    func updateAnimal(_ animal: AnimalEntity) {
        saveContext()
    }
    
    // MARK: - Operações de Eliminação
    
    /// Remove um animal específico da base de dados
    /// - Parameter animal: Animal a eliminar
    func deleteAnimal(_ animal: AnimalEntity) {
        context.delete(animal)
        saveContext()
    }
    
    /// Remove todos os animais da base de dados
    /// Operação irreversível - use com cuidado
    func deleteAllAnimals() {
        let request: NSFetchRequest<NSFetchRequestResult> = AnimalEntity.fetchRequest()
        let deleteRequest = NSBatchDeleteRequest(fetchRequest: request)
        
        do {
            try context.execute(deleteRequest)
            saveContext()
        } catch {
            print("Erro ao eliminar todos os animais: \(error)")
        }
    }
    
    // MARK: - Gestão de Contexto
    
    /// Guarda o contexto se houver alterações pendentes
    private func saveContext() {
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let nserror = error as NSError
                print("Erro ao guardar contexto: \(nserror), \(nserror.userInfo)")
            }
        }
    }
    
    // MARK: - Estatísticas
    
    /// Obtém o número de animais que o utilizador está a seguir
    /// - Returns: Contagem de animais seguidos
    func getFollowingCount() -> Int {
        let request: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        request.predicate = NSPredicate(format: "isFollowing == %@", NSNumber(value: true))
        
        do {
            return try context.count(for: request)
        } catch {
            print("Erro ao contar animais seguidos: \(error)")
            return 0
        }
    }
    
    /// Obtém o número total de animais na base de dados
    /// - Returns: Contagem total de animais
    func getTotalAnimalsCount() -> Int {
        let request: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        
        do {
            return try context.count(for: request)
        } catch {
            print("Erro ao contar total de animais: \(error)")
            return 0
        }
    }
}