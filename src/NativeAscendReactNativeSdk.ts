import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  init(config: Object): Promise<import('./core/Ascend').InitResult>;
  setUser(userId: string): Promise<boolean>;
  getUserId(): Promise<string>;
  setGuest(guestId: string): Promise<boolean>;
  getGuestId(): Promise<string>;
  getStringFlag(
    apiPath: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<string>;
  getBooleanFlag(
    apiPath: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<boolean>;
  getNumberFlag(
    apiPath: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<number>;
  getAllVariables(apiPath: string): Promise<string>;
  getExperimentVariants(): Promise<string>;
  initializeExperiments(): Promise<boolean>;
  refreshExperiment(): Promise<boolean>;
  fetchExperiments(defaultValues: Object): Promise<boolean>;
  isInitialized(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('AscendReactNativeSdk');
