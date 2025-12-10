import Foundation
import Ascend

@objc public class AscendReactNativeSdkSwift: NSObject {
    
  @objc public static func `init`(_ configDict: NSDictionary, completion: @escaping (NSDictionary) -> Void) {
        do {
            guard let configDict = configDict as? [String: Any] else {
                completion(NSDictionary(dictionary: [
                    "success": NSNumber(value: false),
                    "error": "Invalid configuration: expected dictionary"
                ]))
                return
            }
            
            guard let clientConfigDict = configDict["clientConfig"] as? [String: Any],
                  let apiKey = clientConfigDict["apiKey"] as? String,
                  !apiKey.isEmpty else {
                completion(NSDictionary(dictionary: [
                    "success": NSNumber(value: false),
                    "error": "Missing required field: clientConfig.apiKey"
                ]))
                return
            }
            
            let environment = (clientConfigDict["environment"] as? String) ?? "production"
            let enableDebugLogging = (clientConfigDict["enableDebugLogging"] as? NSNumber)?.boolValue ?? false
            let enablePerformanceMonitoring = (clientConfigDict["enablePerformanceMonitoring"] as? NSNumber)?.boolValue ?? true
            let enableCrashReporting = (clientConfigDict["enableCrashReporting"] as? NSNumber)?.boolValue ?? true
            
            let coreConfig = AscendCoreConfig(
                apiKey: apiKey,
                environment: environment,
                enableDebugLogging: enableDebugLogging,
                enablePerformanceMonitoring: enablePerformanceMonitoring,
                enableCrashReporting: enableCrashReporting
            )
            
            var httpConfig: HTTPConfig
            if let httpConfigDict = configDict["httpConfig"] as? [String: Any] {
                let apiBaseUrl = (httpConfigDict["apiBaseUrl"] as? String) ?? "https://api.ascend.com"
                let shouldRetry = (httpConfigDict["shouldRetry"] as? NSNumber)?.boolValue ?? true
                
                let defaultHeaders = extractHeaders(from: httpConfigDict["headers"])
                
                var timeout: TimeInterval = 30.0
                if let timeoutConfigDict = httpConfigDict["timeoutConfig"] as? [String: Any],
                   let callTimeout = timeoutConfigDict["callTimeout"] as? NSNumber {
                    timeout = callTimeout.doubleValue / 1000.0
                }
                
                var retryDelay: TimeInterval = 1.0
                var maxRetries: Int = 3
                if let retrialConfigDict = httpConfigDict["retrialConfig"] as? [String: Any] {
                    if let attempts = retrialConfigDict["attempts"] as? NSNumber {
                        maxRetries = attempts.intValue
                    }
                    if let delayDict = retrialConfigDict["delay"] as? [String: Any],
                       let delayTime = delayDict["time"] as? NSNumber {
                        retryDelay = delayTime.doubleValue / 1000.0
                    }
                }
                
                httpConfig = HTTPConfig(
                    apiBaseUrl: apiBaseUrl,
                    timeout: timeout,
                    shouldRetry: shouldRetry,
                    retryDelay: retryDelay,
                    maxRetries: maxRetries,
                    defaultHeaders: defaultHeaders
                )
            } else {
                httpConfig = HTTPConfig()
            }
            
            var plugins: [AscendPlugin] = []
            if let pluginsArray = configDict["plugins"] as? [[String: Any]] {
                for pluginDict in pluginsArray {
                    guard let pluginName = pluginDict["name"] as? String else { continue }
                    
                    if pluginName.uppercased() == "EXPERIMENTS" {
                        let pluginConfigDict = pluginDict["config"] as? [String: Any] ?? [:]
                        
                        let experimentsApiBaseUrl = (pluginConfigDict["apiBaseUrl"] as? String) ?? httpConfig.apiBaseUrl
                        let experimentsApiEndpoint = (pluginConfigDict["apiEndpoint"] as? String) ?? "/v1/users/experiments"
                        let shouldFetchOnInit = (pluginConfigDict["shouldFetchOnInit"] as? NSNumber)?.boolValue ?? true
                        let shouldRefreshOnForeground = (pluginConfigDict["shouldRefreshDRSOnForeground"] as? NSNumber)?.boolValue ?? 
                                                         (pluginConfigDict["shouldRefreshOnForeground"] as? NSNumber)?.boolValue ?? true
                        let shouldFetchOnLogout = (pluginConfigDict["shouldFetchOnLogout"] as? NSNumber)?.boolValue ?? false
                        let enableCaching = (pluginConfigDict["enableCaching"] as? NSNumber)?.boolValue ?? true
                        let enableDebugLogging = (pluginConfigDict["enableDebugLogging"] as? NSNumber)?.boolValue ?? false
                        let experimentsHeaders = extractHeaders(from: pluginConfigDict["headers"])
                        
                        var defaultValues: [String: ExperimentVariable] = [:]
                        if let defaultValuesDict = pluginConfigDict["defaultValues"] as? [String: Any] {
                            defaultValues = defaultValuesDict.compactMapValues { convertToExperimentVariable($0) }
                        }
                        
                        let experimentsConfig = AscendExperimentsConfiguration(
                            shouldFetchOnInit: shouldFetchOnInit,
                            shouldFetchOnLogout: shouldFetchOnLogout,
                            shouldRefreshOnForeground: shouldRefreshOnForeground,
                            defaultValues: defaultValues,
                            apiBaseUrl: experimentsApiBaseUrl,
                            apiEndpoint: experimentsApiEndpoint,
                            headers: experimentsHeaders.isEmpty ? nil : experimentsHeaders,
                            enableCaching: enableCaching,
                            enableDebugLogging: enableDebugLogging
                        )
                        plugins.append(AscendPlugin(type: .experiments, config: experimentsConfig))
                    }
                }
            }
            
            let ascendConfig = AscendConfig(
                plugins: plugins,
                httpConfig: httpConfig,
                coreConfig: coreConfig
            )
            
            try Ascend.initialize(with: ascendConfig)
            
            if let userId = clientConfigDict["userId"] as? String, !userId.isEmpty {
                Ascend.user.setUser(userId: userId)
            }
            
            completion(NSDictionary(dictionary: [
                "success": NSNumber(value: true),
                "message": "Ascend SDK initialized successfully"
            ]))
            
        } catch let error as AscendError {
            completion(NSDictionary(dictionary: [
                "success": NSNumber(value: false),
                "error": error.localizedDescription
            ]))
        } catch {
            completion(NSDictionary(dictionary: [
                "success": NSNumber(value: false),
                "error": "Unknown error: \(error.localizedDescription)"
            ]))
        }
    }
    
    @objc public static func isInitialized(completion: @escaping (Bool) -> Void) {
        completion(Ascend.isInitialized())
    }
    
    @objc public static func setUser(_ userId: String, completion: @escaping (Bool) -> Void) {
        guard Ascend.isInitialized() else {
            completion(false)
            return
        }
        Ascend.user.setUser(userId: userId)
        completion(true)
    }
    
    @objc public static func getUserId(completion: @escaping (String) -> Void) {
        guard Ascend.isInitialized() else {
            completion("")
            return
        }
        completion(Ascend.user.getUserId())
    }
    
    @objc public static func setGuest(_ guestId: String, completion: @escaping (Bool) -> Void) {
        guard Ascend.isInitialized() else {
            completion(false)
            return
        }
        Ascend.user.setGuest(guestId: guestId)
        completion(true)
    }
    
    @objc public static func getGuestId(completion: @escaping (String) -> Void) {
        guard Ascend.isInitialized() else {
            completion("")
            return
        }
        completion(Ascend.user.getGuestId())
    }
    
    @objc public static func getBooleanFlag(_ experimentKey: String, variable: String, dontCache: Bool, ignoreCache: Bool, completion: @escaping (Bool) -> Void) {
        guard isValidInput(experimentKey, variable), let experiments = try? getExperimentsPlugin() else {
            completion(false)
            return
        }
        let result = experiments.getBoolValue(for: experimentKey, with: variable, dontCache: dontCache, ignoreCache: ignoreCache)
        completion(result)
    }
    
    @objc public static func getNumberFlag(_ experimentKey: String, variable: String, dontCache: Bool, ignoreCache: Bool, completion: @escaping (Double) -> Void) {
        guard isValidInput(experimentKey, variable), let experiments = try? getExperimentsPlugin() else {
            completion(0.0)
            return
        }
        
        // Try getDoubleValue first
        let doubleResult = experiments.getDoubleValue(for: experimentKey, with: variable, dontCache: dontCache, ignoreCache: ignoreCache)
        if doubleResult != -1.0 {
            completion(doubleResult)
            return
        }
        
        // Try int and convert to double
        let intResult = experiments.getIntValue(for: experimentKey, with: variable, dontCache: dontCache, ignoreCache: ignoreCache)
        if intResult != -1 {
            completion(Double(intResult))
            return
        }
        
        // Try long and convert to double
        let longResult = experiments.getLongValue(for: experimentKey, with: variable, dontCache: dontCache, ignoreCache: ignoreCache)
        completion(Double(longResult))
    }
    
    @objc public static func getStringFlag(_ experimentKey: String, variable: String, dontCache: Bool, ignoreCache: Bool, completion: @escaping (String) -> Void) {
        guard isValidInput(experimentKey, variable), let experiments = try? getExperimentsPlugin() else {
            completion("")
            return
        }
        let result = experiments.getStringValue(for: experimentKey, with: variable, dontCache: dontCache, ignoreCache: ignoreCache)
        completion(result)
    }
    
    @objc public static func getAllVariables(_ experimentKey: String, completion: @escaping (String) -> Void) {
        guard Ascend.isInitialized(), !experimentKey.isEmpty else {
            completion("")
            return
        }
        let result = try? getExperimentsPlugin().getAllVariablesJSON(for: experimentKey)
        completion(result ?? "")
    }
    
    @objc public static func getExperimentVariants(completion: @escaping (String) -> Void) {
        guard let experiments = try? getExperimentsPlugin() else {
            completion("{}")
            return
        }
        let variants = experiments.getExperimentVariants()
        var variantsDict: [String: [String: String]] = [:]
        for (experimentKey, variant) in variants {
            variantsDict[experimentKey] = [
                "experimentId": variant.experimentId,
                "variantName": variant.variantName
            ]
        }
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: variantsDict, options: [])
            let jsonString = String(data: jsonData, encoding: .utf8) ?? "{}"
            completion(jsonString)
        } catch {
            completion("{}")
        }
    }
    
    @objc public static func initializeExperiments(completion: @escaping (Bool) -> Void) {
        guard Ascend.isInitialized() else {
            completion(false)
            return
        }
        do {
            let experiments = try getExperimentsPlugin()
            if !experiments.isInitialized {
                try experiments.initialize()
            }
            completion(true)
        } catch {
            completion(false)
        }
    }
    
    @objc public static func refreshExperiment(completion: @escaping (Bool) -> Void) {
        guard Ascend.isInitialized() else {
            completion(false)
            return
        }
        
        do {
            let experiments = try getExperimentsPlugin()
            experiments.refreshExperiments { response, error in
                completion(response != nil && error == nil)
            }
        } catch {
            completion(false)
        }
    }
    
    @objc public static func fetchExperiments(_ defaultValues: NSDictionary, completion: @escaping (Bool) -> Void) {
        guard Ascend.isInitialized() else {
            completion(false)
            return
        }
        
        guard let defaultValuesDict = defaultValues as? [String: Any] else {
            completion(false)
            return
        }
        
        let experimentKeys = Array(defaultValuesDict.keys)
        guard !experimentKeys.isEmpty else {
            completion(false)
            return
        }
        
        do {
            let experiments = try getExperimentsPlugin()
            let experimentKeysDict = Dictionary(uniqueKeysWithValues: experimentKeys.map { ($0, ExperimentVariable.dictionary([:])) })
            
            experiments.fetchExperiments(for: experimentKeysDict) { response, error in
                completion(response != nil && error == nil)
            }
        } catch {
            completion(false)
        }
    }
    
    private static func getExperimentsPlugin() throws -> AscendExperiments {
        guard Ascend.isInitialized() else {
            throw NSError(domain: "AscendReactNativeSdk", code: -1, userInfo: [NSLocalizedDescriptionKey: "SDK not initialized"])
        }
        return try Ascend.getPlugin(AscendExperiments.self)
    }
    
    private static func isValidInput(_ experimentKey: String, _ variable: String) -> Bool {
        return Ascend.isInitialized() && !experimentKey.isEmpty && !variable.isEmpty
    }
    
    private static func extractHeaders(from value: Any?) -> [String: String] {
        guard let headersDict = value as? [String: Any] else { return [:] }
        var headers: [String: String] = [:]
        for (key, value) in headersDict {
            if let stringValue = value as? String {
                headers[key] = stringValue
            }
        }
        return headers
    }
    
    private static func convertToExperimentVariable(_ value: Any) -> ExperimentVariable? {
        if let boolValue = value as? Bool {
            return ExperimentVariable.bool(boolValue)
        } else if let nsNumber = value as? NSNumber {
            let objCType = String(cString: nsNumber.objCType)
            if objCType == "c" || objCType == "B" {
                return ExperimentVariable.bool(nsNumber.boolValue)
            } else if nsNumber.int64Value <= Int.max && nsNumber.int64Value >= Int.min && 
                      (objCType == "i" || objCType == "l" || objCType == "q" || objCType == "s" || objCType == "S" || objCType == "I") {
                return ExperimentVariable.int(nsNumber.intValue)
            } else {
                return ExperimentVariable.double(nsNumber.doubleValue)
            }
        } else if let intValue = value as? Int {
            return ExperimentVariable.int(intValue)
        } else if let doubleValue = value as? Double {
            return ExperimentVariable.double(doubleValue)
        } else if let stringValue = value as? String {
            return ExperimentVariable.string(stringValue)
        } else if let arrayValue = value as? [Any] {
            var experimentVariables: [ExperimentVariable] = []
            for item in arrayValue {
                if let experimentVar = convertToExperimentVariable(item) {
                    experimentVariables.append(experimentVar)
                }
            }
            return ExperimentVariable.list(experimentVariables)
        } else if let dictValue = value as? [String: Any] {
            var experimentDict: [String: ExperimentVariable] = [:]
            for (key, val) in dictValue {
                if let experimentVar = convertToExperimentVariable(val) {
                    experimentDict[key] = experimentVar
                }
            }
            return ExperimentVariable.dictionary(experimentDict)
        }
        return nil
    }
}
