import AscendReactNativeSdk from '../NativeAscendReactNativeSdk';

const Experiments = {
  getStringFlag: (
    experimentKey: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<string> => {
    return AscendReactNativeSdk.getStringFlag(
      experimentKey,
      variable,
      dontCache,
      ignoreCache
    );
  },
  getBooleanFlag: (
    experimentKey: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<boolean> => {
    return AscendReactNativeSdk.getBooleanFlag(
      experimentKey,
      variable,
      dontCache,
      ignoreCache
    );
  },
  getNumberFlag: (
    experimentKey: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<number> => {
    return AscendReactNativeSdk.getNumberFlag(
      experimentKey,
      variable,
      dontCache,
      ignoreCache
    );
  },
  getAllVariables: async <T>(experimentKey: string): Promise<T> => {
    try {
      const val = await AscendReactNativeSdk.getAllVariables(experimentKey);
      if (!val) {
        return {} as T;
      }
      const json = JSON.parse(val);
      return json as T;
    } catch (e) {
      return {} as T;
    }
  },
  getExperimentVariants: async <T>(): Promise<T> => {
    try {
      const result = await AscendReactNativeSdk.getExperimentVariants();
      const json = JSON.parse(result);
      return json as T;
    } catch (e) {
      return {} as T;
    }
  },
  refreshExperiment: (): Promise<boolean> => {
    return AscendReactNativeSdk.refreshExperiment();
  },
  fetchExperiments: (defaultValues: Object): Promise<boolean> => {
    return AscendReactNativeSdk.fetchExperiments(defaultValues);
  },
  initializeExperiments: (): Promise<boolean> => {
    return AscendReactNativeSdk.initializeExperiments();
  },
};

export default Experiments;
