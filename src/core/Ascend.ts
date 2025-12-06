import AscendReactNativeSdk from '../NativeAscendReactNativeSdk';

export interface RetrialDelayConfig {
  time?: number; // Delay time in milliseconds
  policy?: string; // Retry policy: 'LINEAR', 'EXPONENTIAL', etc.
}

export interface RetrialConfig {
  attempts?: number; // Number of retry attempts
  delay?: RetrialDelayConfig; // Delay configuration
}

export interface TimeoutConfig {
  callTimeout?: number; // Request timeout in milliseconds
}

export interface HTTPConfig {
  headers?: { [key: string]: string }; // Default headers for all requests
  shouldRetry?: boolean; // Whether to retry failed requests
  apiBaseUrl?: string; // Base URL for API requests
  retrialConfig?: RetrialConfig; // Retry configuration
  timeoutConfig?: TimeoutConfig; // Timeout configuration
}

export interface PluginConfig {
  name: string; // Plugin name: 'EXPERIMENTS', etc.
  config?: Object; // Plugin-specific configuration
}

export interface ClientConfig {
  apiKey: string; // API key for authentication
  userId?: string; // Optional user ID to set during initialization
  environment?: string; // Environment: 'development' | 'staging' | 'production'
  enableDebugLogging?: boolean; // Whether to enable debug logging
  enablePerformanceMonitoring?: boolean; // Whether to enable performance monitoring
  enableCrashReporting?: boolean; // Whether to enable crash reporting
}

export interface InitResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AscendConfig {
  httpConfig?: HTTPConfig;
  plugins?: PluginConfig[];
  clientConfig: ClientConfig;
}

const Ascend = {
  init: (config: AscendConfig): Promise<InitResult> => {
    return AscendReactNativeSdk.init(config as unknown as Object);
  },
  isInitialized: (): Promise<boolean> => {
    return AscendReactNativeSdk.isInitialized();
  },
  setUser: (userId: string): Promise<boolean> => {
    return AscendReactNativeSdk.setUser(userId);
  },
  getUserId: (): Promise<string> => {
    return AscendReactNativeSdk.getUserId();
  },
  setGuest: (guestId: string): Promise<boolean> => {
    return AscendReactNativeSdk.setGuest(guestId);
  },
  getGuestId: (): Promise<string> => {
    return AscendReactNativeSdk.getGuestId();
  },
};

export default Ascend;
