import CoreMotion
import CoreLocation

// MARK: - Sensor Service
class SensorService: NSObject, CLLocationManagerDelegate {
    
    static let shared = SensorService()
    
    private let motionManager = CMMotionManager()
    private let locationManager = CLLocationManager()
    
    var currentAcceleration: CMAcceleration?
    var currentLocation: CLLocationCoordinate2D?
    
    private override init() {
        super.init()
        setupLocationManager()
    }
    
    // MARK: - Setup Location Manager
    private func setupLocationManager() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }
    
    // MARK: - Accelerometer
    func startAccelerometerUpdates(updateInterval: TimeInterval = 0.1) {
        motionManager.accelerometerUpdateInterval = updateInterval
        
        motionManager.startAccelerometerUpdates(to: OperationQueue.main) { [weak self] data, error in
            if let data = data {
                self?.currentAcceleration = data.acceleration
            }
        }
    }
    
    func stopAccelerometerUpdates() {
        motionManager.stopAccelerometerUpdates()
    }
    
    // MARK: - Gyroscope
    func startGyroscopeUpdates(updateInterval: TimeInterval = 0.1) {
        motionManager.gyroUpdateInterval = updateInterval
        
        motionManager.startGyroUpdates(to: OperationQueue.main) { [weak self] data, error in
            if let data = data {
                // Usar dados de giroscópio conforme necessário
                // Por exemplo: detecção de movimento/shake
            }
        }
    }
    
    func stopGyroscopeUpdates() {
        motionManager.stopGyroUpdates()
    }
    
    // MARK: - Location
    func requestLocationPermission() {
        locationManager.requestWhenInUseAuthorization()
    }
    
    func startLocationUpdates() {
        if CLLocationManager.locationServicesEnabled() {
            locationManager.startUpdatingLocation()
        }
    }
    
    func stopLocationUpdates() {
        locationManager.stopUpdatingLocation()
    }
    
    // MARK: - Ambient Light (via AVCaptureDevice)
    func checkAmbientLight(completion: @escaping (Float?) -> Void) {
        // Nota: iOS não fornece acesso direto ao sensor de luz ambiente
        // Este é um exemplo de como poderíamos aproximar usando técnicas alternativas
        completion(nil)
    }
    
    // MARK: - Proximity Sensor
    func enableProximitySensor() {
        UIDevice.current.isProximityMonitoringEnabled = true
    }
    
    func disableProximitySensor() {
        UIDevice.current.isProximityMonitoringEnabled = false
    }
    
    // MARK: - CLLocationManagerDelegate
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let location = locations.last {
            currentLocation = location.coordinate
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Erro ao obter localização: \(error)")
    }
}
