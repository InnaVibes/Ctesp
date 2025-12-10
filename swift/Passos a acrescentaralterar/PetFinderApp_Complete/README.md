# PetFinder - Adopt-a-Pet with Static Fallback

## Architecture

**Primary API:** Adopt-a-Pet.com
**Fallback API:** Static JSON (GitHub Pages)
**Unified Model:** PetUnifiedModel handles both APIs

## API Flow

1. Check credentials (API Key + Shelter ID)
2. If credentials exist: Try Adopt-a-Pet API
3. On 5xx errors (500/501/502/503) or network failure: Switch to static fallback
4. If no credentials: Use static API directly

## File Structure

### Constants (3 files)
- APIConstants.swift - Both API endpoints
- UIConstants.swift - UI values
- UserDefaultsKeys.swift - Storage keys

### Models (4 files)
- PetUnifiedModel.swift - Unified data model
- AdoptAPetModel.swift - Adopt-a-Pet response structure
- StaticPetModel.swift - Static API response structure
- Achievement.swift - Achievement data

### Network (5 files)
- NetworkError.swift - Error definitions
- APIClient.swift - HTTP client
- APIURLBuilder.swift - URL construction
- CacheManager.swift - In-memory cache
- NetworkManager.swift - Fallback logic

### Extensions (1 file)
- PetUnifiedModel+Extensions.swift - Formatting and localization

### Utils (2 files)
- AlertHelper.swift - Alert utilities
- LoadingHelper.swift - Loading indicators

### Managers (2 files)
- SyncManager.swift - Core Data sync
- AchievementsManager.swift - Achievement system

### Views (2 files)
- AnimalTableViewCell.swift - Pet cell
- AchievementCell.swift - Achievement cell

## Usage

### Configure Adopt-a-Pet credentials
```swift
UserDefaults.standard.set("YOUR_API_KEY", forKey: UserDefaultsKeys.apiKey)
UserDefaults.standard.set("YOUR_SHELTER_ID", forKey: UserDefaultsKeys.shelterId)
```

### Fetch pets (with automatic fallback)
```swift
NetworkManager.shared.fetchPets { result in
    switch result {
    case .success(let pets):
        // pets is [PetUnifiedModel]
        for pet in pets {
            print("\(pet.name) - \(pet.formattedSpecies)")
        }
    case .failure(let error):
        print("Error: \(error)")
    }
}
```

### Configure table view cell
```swift
let cell = tableView.dequeueReusableCell(withIdentifier: UIConstants.animalCellIdentifier) as! AnimalTableViewCell
cell.configure(with: pet, isFollowing: false)
cell.delegate = self
```

## Field Mapping

### Adopt-a-Pet → Unified
- pet_id → id
- name → name
- species → species
- breeds.primary → breed
- breeds.secondary → secondaryBreed
- sex → sex
- age → age
- size → size
- description → description
- photos[0].medium → photoURL
- contact.address.city → city
- contact.address.state → state

### Static API → Unified
- pet_id → id
- pet_name → name
- primary_breed → breed (species detected from breed)
- secondary_breed → secondaryBreed
- sex → sex
- age → age
- size → size
- results_photo_url → photoURL
- addr_city → city
- addr_state_code → state

## Fallback Triggers

NetworkManager switches to static API when:
- HTTP 500 (Internal Server Error)
- HTTP 501 (Not Implemented)
- HTTP 502 (Bad Gateway)
- HTTP 503 (Service Unavailable)
- Network connection failure
- No Adopt-a-Pet credentials configured

## Integration Steps

1. Add all files to Xcode project
2. Configure credentials in Settings screen
3. ViewControllers use PetUnifiedModel
4. Fallback happens automatically
5. Check console logs for API source

## Console Output Examples

**Adopt-a-Pet success:**
```
[Network] Trying Adopt-a-Pet API
[API] GET: https://api.adoptapet.com/search/pets_at_shelter?...
[Network] Success: 150 pets from Adopt-a-Pet
[Cache] Cached 150 pets
```

**Fallback to static:**
```
[Network] Trying Adopt-a-Pet API
[API] GET: https://api.adoptapet.com/search/pets_at_shelter?...
[Network] Adopt-a-Pet 5xx error (503), using static API fallback
[Network] Using static API fallback
[API] GET: https://carlos-aldeias-estg.github.io/pdm2-2025-mock-api/api/pets.json
[Network] Success: 100 pets from static API (fallback)
[Cache] Cached 100 pets
```

**No credentials:**
```
[Network] No Adopt-a-Pet credentials, using static API
[API] GET: https://carlos-aldeias-estg.github.io/pdm2-2025-mock-api/api/pets.json
[Network] Success: 100 pets from static API (fallback)
```

## Notes

- No emojis in code (except achievement SF Symbols)
- Cache expires after 30 minutes (configurable)
- Unified model ensures consistent data structure
- Both APIs return same model format to ViewControllers
- Fallback is transparent to UI layer

## Remaining Integration

Add from original project:
- CoreDataManager.swift
- All ViewControllers
- NotificationService.swift
- Info.plist
- Assets.xcassets
- LaunchScreen.storyboard
- AppDelegate.swift

---

Version: 3.0
Primary: Adopt-a-Pet.com
Fallback: Static JSON API
