import AscendReactNativeSdk from '../NativeAscendReactNativeSdk';

const Experiments = {
  getStringFlag: (
    apiPath: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<string> => {
    return AscendReactNativeSdk.getStringFlag(
      apiPath,
      variable,
      dontCache,
      ignoreCache
    );
  },
  getBooleanFlag: (
    apiPath: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<boolean> => {
    return AscendReactNativeSdk.getBooleanFlag(
      apiPath,
      variable,
      dontCache,
      ignoreCache
    );
  },
  getNumberFlag: (
    apiPath: string,
    variable: string,
    dontCache: boolean,
    ignoreCache: boolean
  ): Promise<number> => {
    return AscendReactNativeSdk.getNumberFlag(
      apiPath,
      variable,
      dontCache,
      ignoreCache
    );
  },
  getAllVariables: async <T>(apiPath: string): Promise<T> => {
    try {
      const val = await AscendReactNativeSdk.getAllVariables(apiPath);
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
