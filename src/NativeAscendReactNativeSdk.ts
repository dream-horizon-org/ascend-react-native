import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  init(config: Object): Promise<import('./core/Ascend').InitResult>;
  setUser(userId: string): Promise<boolean>;
  getUserId(): Promise<string>;
  setStableId(stableId: string): Promise<boolean>;
  getStableId(): Promise<string>;
  getStringFlag(
    experimentKey: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<string>;
  getBooleanFlag(
    experimentKey: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<boolean>;
  getNumberFlag(
    experimentKey: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<number>;
  getAllVariables(experimentKey: string): Promise<string>;
  getExperimentVariants(): Promise<string>;
  initializeExperiments(): Promise<boolean>;
  refreshExperiment(): Promise<boolean>;
  fetchExperiments(defaultValues: Object): Promise<boolean>;
  isInitialized(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('AscendReactNativeSdk');
