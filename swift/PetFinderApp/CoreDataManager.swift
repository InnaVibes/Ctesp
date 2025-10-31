import CoreData

// MARK: - Core Data Manager
class CoreDataManager {
    
    static let shared = CoreDataManager()
    
    private let context: NSManagedObjectContext
    
    private init() {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        self.context = appDelegate.managedObjectContext
    }
    
    // MARK: - Save Following Animal
    func saveFollowingAnimal(_ animal: Animal) {
        let fetchRequest: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "id == %d", animal.id)
        
        do {
            let results = try context.fetch(fetchRequest)
            
            if let existingAnimal = results.first {
                existingAnimal.isFollowing = true
            } else {
                let entity = AnimalEntity(context: context)
                entity.updateFromAnimal(animal)
                entity.isFollowing = true
            }
            
            try context.save()
        } catch {
            print("Erro ao guardar animal: \(error)")
        }
    }
    
    // MARK: - Remove Following Animal
    func removeFollowingAnimal(_ animalId: Int) {
        let fetchRequest: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "id == %d", animalId)
        
        do {
            let results = try context.fetch(fetchRequest)
            if let animal = results.first {
                animal.isFollowing = false
                try context.save()
            }
        } catch {
            print("Erro ao remover animal: \(error)")
        }
    }
    
    // MARK: - Get Following Animals
    func getFollowingAnimals() -> [Animal] {
        let fetchRequest: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "isFollowing == YES")
        
        do {
            let results = try context.fetch(fetchRequest)
            return results.map { entity in
                Animal(
                    id: Int(entity.id),
                    name: entity.name,
                    species: entity.species,
                    breed: entity.breed,
                    gender: entity.gender,
                    age: entity.age,
                    size: nil,
                    description: entity.descriptionText,
                    photoURLs: decodeJSONArray(entity.photoURLs),
                    videos: nil,
                    comments: nil,
                    location: decodeLocation(entity.location),
                    organizationId: nil,
                    url: nil
                )
            }
        } catch {
            print("Erro ao buscar animais seguidos: \(error)")
            return []
        }
    }
    
    // MARK: - Get Following Count
    func getFollowingCount() -> Int {
        let fetchRequest: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "isFollowing == YES")
        
        do {
            return try context.count(for: fetchRequest)
        } catch {
            print("Erro ao contar animais: \(error)")
            return 0
        }
    }
    
    // MARK: - Check if Following
    func isFollowing(_ animalId: Int) -> Bool {
        let fetchRequest: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "id == %d AND isFollowing == YES", animalId)
        
        do {
            return try context.count(for: fetchRequest) > 0
        } catch {
            return false
        }
    }
    
    // MARK: - Clear All Data
    func clearAllData() {
        let fetchRequest: NSFetchRequest<NSFetchRequestExpression> = AnimalEntity.fetchRequest() as! NSFetchRequest<NSFetchRequestExpression>
        let deleteRequest = NSBatchDeleteRequest(fetchRequest: fetchRequest)
        
        do {
            try context.execute(deleteRequest)
            try context.save()
        } catch {
            print("Erro ao limpar dados: \(error)")
        }
    }
    
    // MARK: - Helper Methods
    private func decodeJSONArray(_ jsonString: String?) -> [String]? {
        guard let jsonString = jsonString, let data = jsonString.data(using: .utf8) else {
            return nil
        }
        
        do {
            return try JSONDecoder().decode([String].self, from: data)
        } catch {
            return nil
        }
    }
    
    private func decodeLocation(_ jsonString: String?) -> Location? {
        guard let jsonString = jsonString, let data = jsonString.data(using: .utf8) else {
            return nil
        }
        
        do {
            return try JSONDecoder().decode(Location.self, from: data)
        } catch {
            return nil
        }
    }
}
