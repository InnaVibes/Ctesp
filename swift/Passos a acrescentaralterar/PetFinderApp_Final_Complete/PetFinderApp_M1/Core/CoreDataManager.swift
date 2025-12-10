import Foundation
import CoreData

class CoreDataManager {
    
    static let shared = CoreDataManager()
    private init() {}
    
    // MARK: - Core Data Stack
    
    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "PetFinderModel")
        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("Core Data failed to load: \(error.localizedDescription)")
            }
        }
        return container
    }()
    
    var context: NSManagedObjectContext {
        return persistentContainer.viewContext
    }
    
    func saveContext() {
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                print("⚠️ Error saving context: \(error)")
            }
        }
    }
    
    // MARK: - Following Management
    
    func getFollowingCount() -> Int {
        let request: NSFetchRequest<PetUnifiedModel> = PetUnifiedModel.fetchRequest()
        request.predicate = NSPredicate(format: "isFollowing == YES")
        
        do {
            return try context.count(for: request)
        } catch {
            print("⚠️ Error counting following: \(error)")
            return 0
        }
    }
    
    func fetchFollowingPets() -> [PetUnifiedModel] {
        let request: NSFetchRequest<PetUnifiedModel> = PetUnifiedModel.fetchRequest()
        request.predicate = NSPredicate(format: "isFollowing == YES")
        request.sortDescriptors = [NSSortDescriptor(key: "savedDate", ascending: false)]
        
        do {
            return try context.fetch(request)
        } catch {
            print("⚠️ Error fetching following pets: \(error)")
            return []
        }
    }
    
    func toggleFollowing(petId: String) {
        let request: NSFetchRequest<PetUnifiedModel> = PetUnifiedModel.fetchRequest()
        request.predicate = NSPredicate(format: "id == %@", petId)
        
        do {
            if let pet = try context.fetch(request).first {
                pet.isFollowing.toggle()
                if pet.isFollowing {
                    pet.savedDate = Date()
                }
                saveContext()
            }
        } catch {
            print("⚠️ Error toggling following: \(error)")
        }
    }
    
    // MARK: - Pet Management
    
    func savePet(_ petModel: PetUnifiedModel) {
        let request: NSFetchRequest<PetUnifiedModel> = PetUnifiedModel.fetchRequest()
        request.predicate = NSPredicate(format: "id == %@", petModel.id)
        
        do {
            let existing = try context.fetch(request)
            if existing.isEmpty {
                // Create new
                _ = petModel
                saveContext()
            }
        } catch {
            print("⚠️ Error saving pet: \(error)")
        }
    }
    
    func fetchAllPets() -> [PetUnifiedModel] {
        let request: NSFetchRequest<PetUnifiedModel> = PetUnifiedModel.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(key: "name", ascending: true)]
        
        do {
            return try context.fetch(request)
        } catch {
            print("⚠️ Error fetching pets: \(error)")
            return []
        }
    }
    
    func deletePet(petId: String) {
        let request: NSFetchRequest<PetUnifiedModel> = PetUnifiedModel.fetchRequest()
        request.predicate = NSPredicate(format: "id == %@", petId)
        
        do {
            if let pet = try context.fetch(request).first {
                context.delete(pet)
                saveContext()
            }
        } catch {
            print("⚠️ Error deleting pet: \(error)")
        }
    }
    
    func deleteAllPets() {
        let request: NSFetchRequest<NSFetchRequestResult> = PetUnifiedModel.fetchRequest()
        let deleteRequest = NSBatchDeleteRequest(fetchRequest: request)
        
        do {
            try context.execute(deleteRequest)
            saveContext()
        } catch {
            print("⚠️ Error deleting all pets: \(error)")
        }
    }
}
