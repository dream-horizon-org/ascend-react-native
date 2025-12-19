import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {
  Ascend,
  Experiments,
  type AscendConfig,
} from '@dreamhorizonorg/ascend-rn-sdk';

export default function App() {
  const [status, setStatus] = useState<string>('Not initialized');
  const [result, setResult] = useState<string>('');
  const [userIdInput, setUserIdInput] = useState<string>('148925305');

  // For physical iOS devices, replace 'localhost' with your Mac's IP address
  // Find your IP: System Settings > Network, or run `ipconfig getifaddr en0` in terminal
  const API_PORT = '8100';
  const Experiment_Key = 'common_test';
  const getApiBaseUrl = () => {
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${API_PORT}`;
    }
    // iOS Simulator: use localhost
    // iOS Physical Device: use your Mac's IP (e.g., 'http://192.168.1.100:8100')
    return `http://127.0.0.1:${API_PORT}`;
  };

  const handleInitialize = async () => {
    const apiBaseUrl = getApiBaseUrl();

    const config: AscendConfig = {
      httpConfig: {
        apiBaseUrl,
      },
      plugins: [
        {
          name: 'EXPERIMENTS',
          config: {
            httpConfig: {
              apiBaseUrl,
              apiEndpoint: '/v1/allocations/',
              headers: {
                'x-experiment-keys': Experiment_Key,
              },
            },
            shouldFetchOnInit: true,
            shouldRefreshDRSOnForeground: false,
            defaultValues: {
              [Experiment_Key]: {
                color: 'blue',
                prime: false,
                boolean: false,
                number: 0,
              },
            },
            enableCaching: true,
            enableDebugLogging: true,
          },
        },
      ],
      clientConfig: {
        apiKey: 'my-project',
      },
    };

    const response = await Ascend.init(config);
    setStatus(response.success ? 'Initialized ✅' : `Error: ${response.error}`);
    setResult(JSON.stringify(response, null, 2));
  };

  const handleFetchExperiments = async () => {
    const defaultValues = {
      [Experiment_Key]: {
        color: 'blue',
        boolean: false,
        prime: false,
        number: 0,
      },
    };
    const success = await Experiments.fetchExperiments(defaultValues);
    setResult(
      success
        ? 'Experiments fetched successfully'
        : 'Failed to fetch experiments'
    );
  };

  const handleRefresh = async () => {
    const success = await Experiments.refreshExperiment();
    setResult(
      success
        ? 'Experiments refreshed successfully'
        : 'Failed to refresh experiments'
    );
  };

  const handleGetFlag = async (
    type: 'boolean' | 'number' | 'string',
    variable: string
  ) => {
    let value: any;
    switch (type) {
      case 'boolean':
        value = await Experiments.getBooleanFlag(
          Experiment_Key,
          variable,
          false,
          false
        );
        break;
      case 'number':
        value = await Experiments.getNumberFlag(
          Experiment_Key,
          variable,
          false,
          false
        );
        break;
      case 'string':
        value = await Experiments.getStringFlag(
          Experiment_Key,
          variable,
          false,
          false
        );
        break;
    }
    setResult(`${variable}: ${JSON.stringify(value)}`);
  };

  const handleGetAllVariables = async () => {
    const variables = await Experiments.getAllVariables(Experiment_Key);
    setResult(JSON.stringify(variables, null, 2));
  };

  const handleGetUserId = async () => {
    if (!(await Ascend.isInitialized())) {
      setResult('SDK not initialized');
      return;
    }
    const userId = await Ascend.getUserId();
    setResult(`User ID: ${userId || '(empty)'}`);
  };

  const handleGetExperimentVariants = async () => {
    const variants = await Experiments.getExperimentVariants();
    setResult(JSON.stringify(variants, null, 2));
  };

  const handleIsInitialized = async () => {
    const isInit = await Ascend.isInitialized();
    setResult(`SDK Initialized: ${isInit ? 'Yes ✅' : 'No ❌'}`);
  };

  const handleInitializeExperiments = async () => {
    const success = await Experiments.initializeExperiments();
    setResult(
      success
        ? 'Experiments initialized successfully ✅'
        : 'Failed to initialize experiments ❌'
    );
  };

  const handleSetUser = async () => {
    const success = await Ascend.setUser(userIdInput.trim());
    setResult(
      success
        ? `User set successfully: ${userIdInput.trim()} ✅`
        : 'Failed to set user ❌'
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ascend SDK Playground</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status: {status}</Text>
        <TouchableOpacity style={styles.button} onPress={handleInitialize}>
          <Text style={styles.buttonText}>Initialize</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleIsInitialized}>
          <Text style={styles.buttonText}>Check Initialized</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiments</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleInitializeExperiments}
        >
          <Text style={styles.buttonText}>Initialize Experiments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleFetchExperiments}
        >
          <Text style={styles.buttonText}>Fetch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flags</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => handleGetFlag('boolean', 'prime')}
          >
            <Text style={styles.buttonText}>Bool</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => handleGetFlag('number', 'number')}
          >
            <Text style={styles.buttonText}>Number</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => handleGetFlag('string', 'color')}
          >
            <Text style={styles.buttonText}>String</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Management</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter User ID"
          value={userIdInput}
          onChangeText={setUserIdInput}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleSetUser}>
          <Text style={styles.buttonText}>Set User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleGetUserId}>
          <Text style={styles.buttonText}>Get User ID</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilities</Text>
        <TouchableOpacity style={styles.button} onPress={handleGetAllVariables}>
          <Text style={styles.buttonText}>All Variables</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetExperimentVariants}
        >
          <Text style={styles.buttonText}>Get Experiment Variants</Text>
        </TouchableOpacity>
      </View>

      {result ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Result</Text>
          <Text style={styles.result} selectable>
            {result}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    alignItems: 'center',
  },
  smallButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  result: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
