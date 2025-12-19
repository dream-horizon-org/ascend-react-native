import AscendReactNativeSdk from '../NativeAscendReactNativeSdk';

export interface RetrialDelayConfig {
  time?: number;
  policy?: string;
}

export interface RetrialConfig {
  attempts: number;
  delay?: RetrialDelayConfig;
}

export interface TimeoutConfig {
  callTimeout: number;
}

export interface HTTPConfig {
  headers?: { [key: string]: string };
  shouldRetry?: boolean;
  apiBaseUrl: string;
  apiEndpoint?: string;
  retrialConfig?: RetrialConfig;
  timeoutConfig?: TimeoutConfig;
}

export interface PluginConfig {
  name: string;
  config: {
    httpConfig: HTTPConfig;
    shouldFetchOnInit?: boolean;
    shouldRefreshDRSOnForeground?: boolean;
    defaultValues: { [key: string]: any };
    enableCaching?: boolean;
    enableDebugLogging?: boolean;
  };
}

export interface ClientConfig {
  apiKey: string;
  userId?: string;
  environment?: string;
  enableDebugLogging?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableCrashReporting?: boolean;
}

export interface InitResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AscendConfig {
  httpConfig: HTTPConfig;
  plugins: PluginConfig[];
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
};

export default Ascend;
