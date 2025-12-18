# Ascend React Native SDK

A React Native wrapper for the Ascend SDK, providing experimentation and feature flag capabilities for mobile applications.

## Features

- 🚀 **Easy Integration**: Simple setup with minimal configuration
- 🎯 **A/B Testing**: Run experiments and manage feature flags
- 📱 **Cross-Platform**: Works on both iOS and Android
- ⚡ **TurboModule**: Built using React Native's new architecture for better performance
- 💾 **Caching**: Built-in caching support for offline scenarios
- 🔄 **Real-time Updates**: Refresh experiments on-demand or on app foreground

## Installation

```bash
npm install react-native-ascend-react-native-sdk
```

or

```bash
yarn add react-native-ascend-react-native-sdk
```

### iOS Setup

After installing the package, run:

```bash
cd ios && pod install
```

### Android Setup

No additional setup required. The package will be automatically linked.

## Usage

### Initialize the SDK

```typescript
import { Ascend } from 'react-native-ascend-react-native-sdk';

const config = {
  httpConfig: {
    apiBaseUrl: 'https://your-api-url.com',
  },
  plugins: [
    {
      name: 'EXPERIMENTS',
      config: {
        httpConfig: {
          apiBaseUrl: 'https://your-api-url.com',
          apiEndpoint: '/v1/allocations/',
          headers: {
            'x-experiment-keys': 'your-experiment-key',
          },
        },
        shouldFetchOnInit: true,
        shouldRefreshDRSOnForeground: false,
        defaultValues: {
          'experiment-key': {
            color: 'blue',
            enabled: true,
            count: 0,
          },
        },
        enableCaching: true,
        enableDebugLogging: false,
      },
    },
  ],
  clientConfig: {
    apiKey: 'your-api-key',
    userId: 'user-123', // Optional
    environment: 'production', // Optional: 'development' | 'staging' | 'production'
  },
};

const result = await Ascend.init(config);
if (result.success) {
  console.log('SDK initialized successfully');
} else {
  console.error('Initialization failed:', result.error);
}
```

### User Management

```typescript
import { Ascend } from 'react-native-ascend-react-native-sdk';

// Set user ID
await Ascend.setUser('user-123');

// Get current user ID
const userId = await Ascend.getUserId();

// Check if SDK is initialized
const isInitialized = await Ascend.isInitialized();
```

### Experiments

```typescript
import { Experiments } from 'react-native-ascend-react-native-sdk';

// Get a string flag
const color = await Experiments.getStringFlag(
  'experiment-key',
  'color',
  false, // dontCache
  false  // ignoreCache
);

// Get a boolean flag
const isEnabled = await Experiments.getBooleanFlag(
  'experiment-key',
  'enabled',
  false,
  false
);

// Get a number flag
const count = await Experiments.getNumberFlag(
  'experiment-key',
  'count',
  false,
  false
);

// Get all variables for an experiment
interface MyExperiment {
  color: string;
  enabled: boolean;
  count: number;
}

const variables = await Experiments.getAllVariables<MyExperiment>('experiment-key');

// Get all experiment variants
const variants = await Experiments.getExperimentVariants();

// Refresh experiments from server
await Experiments.refreshExperiment();

// Fetch experiments with default values
await Experiments.fetchExperiments({
  'experiment-key': {
    color: 'blue',
    enabled: true,
    count: 0,
  },
});
```

## API Reference

### Ascend

#### `init(config: AscendConfig): Promise<InitResult>`

Initialize the Ascend SDK with the provided configuration.

#### `isInitialized(): Promise<boolean>`

Check if the SDK has been initialized.

#### `setUser(userId: string): Promise<boolean>`

Set the current user ID.

#### `getUserId(): Promise<string>`

Get the current user ID.

### Experiments

#### `getStringFlag(experimentKey: string, variable: string, dontCache: boolean, ignoreCache: boolean): Promise<string>`

Get a string flag value from an experiment.

#### `getBooleanFlag(experimentKey: string, variable: string, dontCache: boolean, ignoreCache: boolean): Promise<boolean>`

Get a boolean flag value from an experiment.

#### `getNumberFlag(experimentKey: string, variable: string, dontCache: boolean, ignoreCache: boolean): Promise<number>`

Get a number flag value from an experiment.

#### `getAllVariables<T>(experimentKey: string): Promise<T>`

Get all variables for a specific experiment.

#### `getExperimentVariants<T>(): Promise<T>`

Get all experiment variants for the current user.

#### `refreshExperiment(): Promise<boolean>`

Refresh experiment data from the server.

#### `fetchExperiments(defaultValues: Object): Promise<boolean>`

Fetch experiments with default values.

#### `initializeExperiments(): Promise<boolean>`

Initialize the experiments plugin.

## Configuration Options

### AscendConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `httpConfig` | `HTTPConfig` | Yes | HTTP configuration for network requests |
| `plugins` | `PluginConfig[]` | Yes | Array of plugin configurations |
| `clientConfig` | `ClientConfig` | Yes | Client configuration |

### HTTPConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `apiBaseUrl` | `string` | Yes | Base URL for API requests |
| `headers` | `{ [key: string]: string }` | No | Default headers for all requests |
| `shouldRetry` | `boolean` | No | Whether to retry failed requests |
| `apiEndpoint` | `string` | No | API endpoint path |
| `retrialConfig` | `RetrialConfig` | No | Retry configuration |
| `timeoutConfig` | `TimeoutConfig` | No | Timeout configuration |

### ClientConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `apiKey` | `string` | Yes | API key for authentication |
| `userId` | `string` | No | User ID to set during initialization |
| `environment` | `string` | No | Environment: 'development', 'staging', or 'production' |
| `enableDebugLogging` | `boolean` | No | Enable debug logging |
| `enablePerformanceMonitoring` | `boolean` | No | Enable performance monitoring |
| `enableCrashReporting` | `boolean` | No | Enable crash reporting |

## Example App

The repository includes an example app demonstrating all SDK features. To run it:

```bash
# Install dependencies
yarn

# Run on iOS
yarn example ios

# Run on Android
yarn example android
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing or engaging in discussions.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
