# Ascend React Native SDK - Example App

This example app demonstrates how to use the `@dreamhorizonorg/ascend-react-native` package in a React Native application.

## 🎯 What's Demonstrated

This example showcases all the key features of the Ascend SDK:

### Core Features

- ✅ **SDK Initialization** - Setting up the SDK with configuration
- ✅ **User Management** - Setting and retrieving user IDs
- ✅ **Experiment Fetching** - Fetching experiments with default values
- ✅ **Feature Flags** - Getting boolean, number, and string flags
- ✅ **Variable Retrieval** - Getting all variables for an experiment
- ✅ **Experiment Refresh** - Refreshing experiments from the server
- ✅ **Error Handling** - Proper error handling and user feedback
- ✅ **Loading States** - Managing loading states during async operations

## 📁 Project Structure

```
example/
├── src/
│   └── App.tsx          # Main example implementation
├── ios/                 # iOS native project
│   ├── Podfile          # CocoaPods configuration
│   └── ...
├── android/             # Android native project
│   └── ...
├── package.json         # Dependencies
└── README.md           # This file
```

## 🚀 Running the Example

### Prerequisites

- Node.js >= 20
- Yarn 3.6.1
- For iOS: Xcode 14+ and CocoaPods
- For Android: Android Studio and JDK 17+

### Setup

1. **Install dependencies** (from the root of the repository):

   ```bash
   yarn install
   ```

2. **For iOS**, install pods:
   ```bash
   cd example/ios
   pod install
   cd ../..
   ```

### Running on iOS

```bash
yarn example ios
```

Or from the example directory:

```bash
cd example
yarn ios
```

### Running on Android

```bash
yarn example android
```

Or from the example directory:

```bash
cd example
yarn android
```

## 🔧 Configuration

The example app is configured to connect to a local API server. Update the configuration in `src/App.tsx`:

```typescript
const config: AscendConfig = {
  httpConfig: {
    apiBaseUrl: 'http://127.0.0.1:8100', // Change to your API URL
  },
  plugins: [
    {
      name: 'EXPERIMENTS',
      config: {
        httpConfig: {
          apiBaseUrl: 'http://127.0.0.1:8100',
          apiEndpoint: '/v1/allocations/',
          headers: {
            'x-experiment-keys': 'common_test', // Your experiment keys
          },
        },
        defaultValues: {
          common_test: {
            color: 'blue',
            boolean: false,
            number: 0,
            prime: 0,
          },
        },
        shouldFetchOnInit: true,
        enableDebugLogging: true,
        enableCaching: true,
      },
    },
  ],
  clientConfig: {
    apiKey: 'your-api-key-here', // Your API key
    userId: '', // Optional: Set a user ID
  },
};
```

## 📱 Features in the Example

### 1. Initialize SDK

Demonstrates how to initialize the Ascend SDK with proper configuration including:

- API base URL
- Experiment keys
- Default values
- Caching and debug logging

### 2. User Management

Shows how to:

- Set a user ID
- Retrieve the current user ID
- Check initialization status

### 3. Fetch Experiments

Demonstrates fetching experiments with default values:

```typescript
await Experiments.fetchExperiments({
  common_test: {
    color: 'blue',
    boolean: false,
    number: 0,
    prime: 0,
  },
});
```

### 4. Get Feature Flags

Examples of retrieving different types of flags:

```typescript
// Boolean flag
const boolValue = await Experiments.getBooleanFlag(
  'common_test',
  'boolean',
  false,
  false
);

// Number flag
const numValue = await Experiments.getNumberFlag(
  'common_test',
  'number',
  false,
  false
);

// String flag
const strValue = await Experiments.getStringFlag(
  'common_test',
  'color',
  false,
  false
);
```

### 5. Get All Variables

Shows how to retrieve all variables for an experiment:

```typescript
const allVars = await Experiments.getAllVariables('common_test');
```

### 6. Refresh Experiments

Demonstrates refreshing experiment data from the server:

```typescript
await Experiments.refreshExperiment();
```

## 🎨 UI Components

The example includes a clean, modern UI with:

- Status indicators for SDK initialization
- Interactive buttons for each feature
- Real-time result display
- Error handling with user-friendly messages
- Loading states during async operations
- Color-coded status badges

## 🐛 Debugging

### Enable Debug Logging

Set `enableDebugLogging: true` in the experiments config to see detailed logs:

```typescript
config: {
  enableDebugLogging: true,
  // ... other config
}
```

### iOS Logs

```bash
# View iOS logs
npx react-native log-ios
```

### Android Logs

```bash
# View Android logs
npx react-native log-android
```

## 📝 Code Snippets

### Basic Initialization

```typescript
import { Ascend, Experiments } from '@dreamhorizonorg/ascend-react-native';

const result = await Ascend.init(config);
if (result.success) {
  console.log('✅ SDK initialized');
} else {
  console.error('❌ Initialization failed:', result.error);
}
```

### Setting User

```typescript
const success = await Ascend.setUser('user-123');
if (success) {
  const userId = await Ascend.getUserId();
  console.log('Current user:', userId);
}
```

### Getting Flags with Type Safety

```typescript
interface MyExperiment {
  color: string;
  boolean: boolean;
  number: number;
  prime: number;
}

const variables =
  await Experiments.getAllVariables<MyExperiment>('common_test');
console.log('Color:', variables.color);
console.log('Enabled:', variables.boolean);
```

## 🔗 Related Documentation

- [Main README](../README.md) - Package documentation
- [API Reference](../README.md#api-reference) - Complete API documentation
- [Publishing Guide](../PUBLISHING.md) - How to publish the package
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute

## 💡 Tips

1. **API Server**: Make sure your API server is running and accessible
2. **Network Requests**: On iOS simulator, use `http://127.0.0.1` instead of `localhost`
3. **Android Emulator**: Use `http://10.0.2.2` to access localhost from Android emulator
4. **Caching**: Clear app data to reset cached experiments
5. **Debug Mode**: Enable debug logging to troubleshoot issues

## 🆘 Troubleshooting

### iOS Build Issues

```bash
cd example/ios
pod deintegrate
pod install
cd ../..
yarn example ios
```

### Android Build Issues

```bash
cd example/android
./gradlew clean
cd ../..
yarn example android
```

### Metro Bundler Issues

```bash
# Clear Metro cache
yarn start --reset-cache
```

## 📄 License

MIT

---

For more information, visit the [main repository](https://github.com/dream-horizon-org/ascend-react-native).
