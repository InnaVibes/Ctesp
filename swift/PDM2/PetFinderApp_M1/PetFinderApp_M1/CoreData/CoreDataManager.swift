import CoreData
import UIKit

class CoreDataManager {
    
    static let shared = CoreDataManager()
    
    private init() {}
    
    var context: NSManagedObjectContext {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            fatalError("Unable to access AppDelegate")
        }
        return appDelegate.managedObjectContext
    }
    
    // MARK: - Fetch Animals
    
    func fetchAllAnimals() -> [AnimalEntity] {
        let request: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(key: "savedDate", ascending: false)]
        
        do {
            return try context.fetch(request)
        } catch {
            print("Error fetching animals: \(error)")
            return []
        }
    }
    
    func fetchFollowingAnimals() -> [AnimalEntity] {
        let request: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        request.predicate = NSPredicate(format: "isFollowing == %@", NSNumber(value: true))
        request.sortDescriptors = [NSSortDescriptor(key: "savedDate", ascending: false)]
        
        do {
            return try context.fetch(request)
        } catch {
            print("Error fetching following animals: \(error)")
            return []
        }
    }
    
    func fetchAnimal(byId id: Int64) -> AnimalEntity? {
        let request: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        request.predicate = NSPredicate(format: "id == %lld", id)
        request.fetchLimit = 1
        
        do {
            let results = try context.fetch(request)
            return results.first
        } catch {
            print("Error fetching animal by id: \(error)")
            return nil
        }
    }
    
    // MARK: - Save Animal
    
    func saveAnimal(id: Int64, name: String, species: String, breed: String, 
                   gender: String, age: String, descriptionText: String?, 
                   photoURLs: String?, location: String?) -> AnimalEntity? {
        
        // Check if animal already exists
        if let existingAnimal = fetchAnimal(byId: id) {
            return existingAnimal
        }
        
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
    
    // MARK: - Update Animal
    
    func toggleFollowing(for animal: AnimalEntity) {
        animal.isFollowing.toggle()
        saveContext()
    }
    
    func updateAnimal(_ animal: AnimalEntity) {
        saveContext()
    }
    
    // MARK: - Delete Operations
    
    func deleteAnimal(_ animal: AnimalEntity) {
        context.delete(animal)
        saveContext()
    }
    
    func deleteAllAnimals() {
        let request: NSFetchRequest<NSFetchRequestResult> = AnimalEntity.fetchRequest()
        let deleteRequest = NSBatchDeleteRequest(fetchRequest: request)
        
        do {
            try context.execute(deleteRequest)
            saveContext()
        } catch {
            print("Error deleting all animals: \(error)")
        }
    }
    
    // MARK: - Context Operations
    
    private func saveContext() {
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let nserror = error as NSError
                print("Error saving context: \(nserror), \(nserror.userInfo)")
            }
        }
    }
    
    // MARK: - Statistics
    
    func getFollowingCount() -> Int {
        let request: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        request.predicate = NSPredicate(format: "isFollowing == %@", NSNumber(value: true))
        
        do {
            return try context.count(for: request)
        } catch {
            print("Error counting following animals: \(error)")
            return 0
        }
    }
    
    func getTotalAnimalsCount() -> Int {
        let request: NSFetchRequest<AnimalEntity> = AnimalEntity.fetchRequest()
        
        do {
            return try context.count(for: request)
        } catch {
            print("Error counting total animals: \(error)")
            return 0
        }
    }
}
