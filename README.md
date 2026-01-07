# Ascend React Native SDK

Feature flags and A/B testing for React Native apps.

## Installation

```bash
npm install @dreamhorizonorg/ascend-react-native
# or
yarn add @dreamhorizonorg/ascend-react-native
```

**iOS only:** Run `cd ios && pod install`

## Development Setup

This project uses **Yarn 3.6.1** and requires **Corepack** to be enabled. If you encounter `yarn: command not found` or version issues, follow these steps:

### Enable Corepack (Recommended)

```bash
sudo corepack enable
```

After enabling corepack, `yarn` commands will work normally and automatically use the correct version (3.6.1).

### Alternative: Use Corepack Prefix

If you prefer not to enable corepack globally, prefix all yarn commands with `corepack`:

```bash
corepack yarn install
corepack yarn example ios
```

> **Note:** This project specifies `"packageManager": "yarn@3.6.1"` in `package.json`, which requires corepack to ensure everyone uses the same Yarn version.

## Quick Start

### 1. Initialize the SDK

Initialize the Ascend SDK in your app's entry point (e.g., `App.tsx` or `index.js`). The SDK requires three main configurations:

- **Client Config**: Your API key and user identification
- **HTTP Config**: Base URL for API requests
- **Plugins**: Enable experiments/feature flags functionality

```typescript
import { Ascend } from '@dreamhorizonorg/ascend-react-native';

// Initialize with configuration
const result = await Ascend.init({
  // Client authentication and user settings
  clientConfig: {
    apiKey: 'your-api-key', // Required: Your Ascend API key
    userId: 'user-123', // Optional: Set user during initialization
    environment: 'production', // Optional: 'development' | 'staging' | 'production'
    enableDebugLogging: false, // Optional: Enable debug logs for troubleshooting
  },

  // Base HTTP configuration
  httpConfig: {
    apiBaseUrl: 'https://your-api-url.com', // Required: Your API base URL
  },

  // Enable experiments plugin for feature flags and A/B testing
  plugins: [
    {
      name: 'EXPERIMENTS',
      config: {
        // HTTP settings specific to experiments
        httpConfig: {
          apiBaseUrl: 'https://your-api-url.com',
          apiEndpoint: '/v1/allocations/',
          headers: {
            'x-experiment-keys': 'your-experiment-key', // Your experiment keys
          },
        },

        // Default values used as fallback when API is unavailable
        defaultValues: {
          'button-color': {
            color: 'blue',
            enabled: true,
            size: 'medium',
          },
          'new-feature': {
            enabled: false,
          },
        },

        // Caching and behavior settings
        enableCaching: true, // Enable offline caching
        shouldFetchOnInit: true, // Fetch experiments on initialization
        shouldRefreshDRSOnForeground: false, // Auto-refresh when app comes to foreground
      },
    },
  ],
});

// Check initialization status
if (result.success) {
  console.log('✅ SDK initialized successfully');
} else {
  console.error('❌ Initialization failed:', result.error);
}
```

### 2. Use Feature Flags

Once initialized, retrieve feature flags and experiment values anywhere in your app:

```typescript
import { Experiments } from '@dreamhorizonorg/ascend-react-native';

// Get individual flag values
const color = await Experiments.getStringFlag('button-color', 'color');
// Returns: 'blue'

const isEnabled = await Experiments.getBooleanFlag('button-color', 'enabled');
// Returns: true

const size = await Experiments.getStringFlag('button-color', 'size');
// Returns: 'medium'

// Get all variables for an experiment at once (recommended for multiple values)
const buttonConfig = await Experiments.getAllVariables('button-color');
// Returns: { color: 'blue', enabled: true, size: 'medium' }

// Use in your components
function MyButton() {
  const [config, setConfig] = useState({ color: 'blue', enabled: true });

  useEffect(() => {
    Experiments.getAllVariables('button-color').then(setConfig);
  }, []);

  if (!config.enabled) return null;

  return <Button color={config.color} size={config.size} />;
}
```

### 3. Manage Users

Update the user context when users log in/out or switch accounts:

```typescript
import { Ascend } from '@dreamhorizonorg/ascend-react-native';

// Set or update user ID (e.g., after login)
await Ascend.setUser('new-user-id');

// Get current user ID
const userId = await Ascend.getUserId();
console.log('Current user:', userId);

// Check if SDK is ready
const isReady = await Ascend.isInitialized();
if (isReady) {
  // Safe to use experiments
}
```

### 4. Refresh Experiments

Manually refresh experiment data from the server when needed:

```typescript
import { Experiments } from '@dreamhorizonorg/ascend-react-native';

// Refresh all experiments (e.g., after user action or on app foreground)
await Experiments.refreshExperiment();

// Fetch experiments with updated default values
await Experiments.fetchExperiments({
  'button-color': { color: 'red', enabled: true, size: 'large' },
  'new-feature': { enabled: true },
});
```

## Core Methods

### Experiments

| Method                          | Description         | Example                                                |
| ------------------------------- | ------------------- | ------------------------------------------------------ |
| `getStringFlag(key, variable)`  | Get string value    | `await Experiments.getStringFlag('exp-1', 'color')`    |
| `getBooleanFlag(key, variable)` | Get boolean value   | `await Experiments.getBooleanFlag('exp-1', 'enabled')` |
| `getNumberFlag(key, variable)`  | Get number value    | `await Experiments.getNumberFlag('exp-1', 'count')`    |
| `getAllVariables<T>(key)`       | Get all variables   | `await Experiments.getAllVariables('exp-1')`           |
| `refreshExperiment()`           | Refresh from server | `await Experiments.refreshExperiment()`                |

### Ascend

| Method            | Description                 |
| ----------------- | --------------------------- |
| `init(config)`    | Initialize SDK              |
| `setUser(userId)` | Set current user            |
| `getUserId()`     | Get current user            |
| `isInitialized()` | Check initialization status |

## Configuration

### Required Config

```typescript
{
  clientConfig: {
    apiKey: string;           // Your API key
    userId?: string;          // Optional: Set user during init
  },
  httpConfig: {
    apiBaseUrl: string;       // Your API base URL
  },
  plugins: [{
    name: 'EXPERIMENTS',
    config: {
      httpConfig: {
        apiBaseUrl: string;
        apiEndpoint: string;
        headers?: object;
      },
      defaultValues: object;  // Fallback values
    }
  }]
}
```

### Optional Config

```typescript
{
  clientConfig: {
    environment?: 'development' | 'staging' | 'production';
    enableDebugLogging?: boolean;
  },
  plugins: [{
    config: {
      enableCaching?: boolean;
      shouldFetchOnInit?: boolean;
      shouldRefreshDRSOnForeground?: boolean;
    }
  }]
}
```

## Example App

Run the example app to see all features in action:

```bash
yarn install
yarn example ios    # or yarn example android
```

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
