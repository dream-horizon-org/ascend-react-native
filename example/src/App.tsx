import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  Ascend,
  Experiments,
  type AscendConfig,
} from 'react-native-ascend-react-native-sdk';

export default function App() {
  const [status, setStatus] = useState<string>('Not initialized');
  const [result, setResult] = useState<string>('');
  const [userIdInput, setUserIdInput] = useState<string>('148925305');
  const [guestIdInput, setGuestIdInput] = useState<string>('');

  const handleInitialize = async () => {
    const config: AscendConfig = {
      httpConfig: {
        headers: {
          'api-key': '0a4bcafc-d0b2-4477-9482-f9ba57cf58f3',
          'user-id': '148925305',
          'content-type': 'application/json',
          'Accept': 'application/json',
        },
        shouldRetry: true,
        apiBaseUrl: 'https://api.dream11.com',
        retrialConfig: {
          attempts: 2,
          delay: { time: 200, policy: 'LINEAR' },
        },
        timeoutConfig: { callTimeout: 15000 },
      },
      plugins: [
        {
          name: 'EXPERIMENTS',
          config: {
            shouldFetchOnInit: true,
            shouldRefreshDRSOnForeground: false,
            defaultValues: {
              test_variants_31: {
                color: 'blue',
                prime: true,
                boolean: false,
                number: 0,
              },
            },
            apiBaseUrl: 'https://api.dream11.com',
            apiEndpoint: '/v1/users/experiments',
            headers: {
              'api-key': '0a4bcafc-d0b2-4477-9482-f9ba57cf58f3',
              'content-type': 'application/json',
              'user-id': '148925305',
              'Accept': 'application/json',
            },
            enableCaching: true,
            enableDebugLogging: true,
          },
        },
      ],
      clientConfig: {
        apiKey: '0a4bcafc-d0b2-4477-9482-f9ba57cf58f3',
        userId: '148925305',
        environment: 'development',
        enableDebugLogging: true,
        enablePerformanceMonitoring: true,
        enableCrashReporting: true,
      },
    };

    try {
      const response = await Ascend.init(config);
      setStatus(
        response.success ? 'Initialized ✅' : `Error: ${response.error}`
      );
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setStatus(`Error: ${error}`);
      setResult(`Error: ${error}`);
    }
  };

  const handleFetchExperiments = async () => {
    if (!(await Ascend.isInitialized())) {
      setResult('SDK not initialized');
      return;
    }
    try {
      const defaultValues = {
        test_variants_31: {
          color: 'blue',
          boolean: false,
          prime: true,
          number: 0,
        },
      };
      const success = await Experiments.fetchExperiments(defaultValues);
      setResult(
        success
          ? 'Experiments fetched successfully'
          : 'Failed to fetch experiments'
      );
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const handleRefresh = async () => {
    if (!(await Ascend.isInitialized())) {
      setResult('SDK not initialized');
      return;
    }
    try {
      const success = await Experiments.refreshExperiment();
      setResult(
        success
          ? 'Experiments refreshed successfully'
          : 'Failed to refresh experiments'
      );
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const handleGetFlag = async (
    type: 'boolean' | 'number' | 'string',
    variable: string
  ) => {
    if (!(await Ascend.isInitialized())) {
      setResult('SDK not initialized');
      return;
    }
    try {
      let value: any;
      switch (type) {
        case 'boolean':
          value = await Experiments.getBooleanFlag(
            'test_variants_31',
            variable,
            false,
            false
          );
          break;
        case 'number':
          value = await Experiments.getNumberFlag(
            'test_variants_31',
            variable,
            false,
            false
          );
          break;
        case 'string':
          value = await Experiments.getStringFlag(
            'test_variants_31',
            variable,
            false,
            false
          );
          break;
      }
      setResult(`${variable}: ${JSON.stringify(value)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const handleGetAllVariables = async () => {
    if (!(await Ascend.isInitialized())) {
      setResult('SDK not initialized');
      return;
    }
    try {
      const variables = await Experiments.getAllVariables('test_variants_31');
      setResult(JSON.stringify(variables) || 'No variables found');
    } catch (error) {
      setResult(`Error: ${error}`);
    }
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
    if (!(await Ascend.isInitialized())) {
      setResult('SDK not initialized');
      return;
    }
    try {
      const variants = await Experiments.getExperimentVariants();
      setResult(JSON.stringify(variants, null, 2) || 'No variants found');
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const handleIsInitialized = async () => {
    try {
      const isInit = await Ascend.isInitialized();
      setResult(`SDK Initialized: ${isInit ? 'Yes ✅' : 'No ❌'}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const handleInitializeExperiments = async () => {
    if (!(await Ascend.isInitialized())) {
      setResult('SDK not initialized');
      return;
    }
    try {
      const success = await Experiments.initializeExperiments();
      setResult(
        success
          ? 'Experiments initialized successfully ✅'
          : 'Failed to initialize experiments ❌'
      );
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const handleSetUser = async () => {
    if (!(await Ascend.isInitialized())) {
      setResult('SDK not initialized');
      return;
    }
    if (!userIdInput.trim()) {
      setResult('Please enter a user ID');
      return;
    }
    try {
      const success = await Ascend.setUser(userIdInput.trim());
      setResult(
        success
          ? `User set successfully: ${userIdInput.trim()} ✅`
          : 'Failed to set user ❌'
      );
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const handleSetGuest = async () => {
    if (!(await Ascend.isInitialized())) {
      setResult('SDK not initialized');
      return;
    }
    if (!guestIdInput.trim()) {
      setResult('Please enter a guest ID');
      return;
    }
    try {
      const success = await Ascend.setGuest(guestIdInput.trim());
      setResult(
        success
          ? `Guest set successfully: ${guestIdInput.trim()} ✅`
          : 'Failed to set guest ❌'
      );
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const handleGetGuestId = async () => {
    if (!(await Ascend.isInitialized())) {
      setResult('SDK not initialized');
      return;
    }
    try {
      const guestId = await Ascend.getGuestId();
      setResult(`Guest ID: ${guestId || '(empty)'}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
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
        <TextInput
          style={styles.input}
          placeholder="Enter Guest ID"
          value={guestIdInput}
          onChangeText={setGuestIdInput}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleSetGuest}>
          <Text style={styles.buttonText}>Set Guest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleGetGuestId}>
          <Text style={styles.buttonText}>Get Guest ID</Text>
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
