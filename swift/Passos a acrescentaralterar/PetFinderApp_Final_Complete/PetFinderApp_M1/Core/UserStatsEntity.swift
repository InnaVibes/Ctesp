import Foundation
import CoreData

@objc(UserStatsEntity)
public class UserStatsEntity: NSManagedObject {
    
    @NSManaged public var appOpenCount: Int64
    @NSManaged public var firstOpenDate: Date?
    @NSManaged public var lastOpenDate: Date?
    @NSManaged public var totalAnimalsViewed: Int64
    @NSManaged public var totalSearches: Int64
    @NSManaged public var totalShares: Int64
}

extension UserStatsEntity {
    
    @nonobjc public class func fetchRequest() -> NSFetchRequest<UserStatsEntity> {
        return NSFetchRequest<UserStatsEntity>(entityName: "UserStatsEntity")
    }
}
