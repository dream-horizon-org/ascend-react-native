package com.ascendreactnativesdk

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.module.annotations.ReactModule
import com.application.ascend_android.Ascend
import com.application.ascend_android.AscendConfig
import com.application.ascend_android.PluginConfig
import com.application.ascend_android.HttpConfig
import com.application.ascend_android.ClientConfig
import com.application.ascend_android.RetrialConfig
import com.application.ascend_android.Delay
import com.application.ascend_android.Plugins
import com.application.ascend_android.RetryPolicy
import com.application.ascend_android.TimeoutConfig
import com.application.ascend_android.DRSPlugin
import com.application.ascend_android.ExperimentConfig
import com.application.ascend_android.IExperimentCallback
import com.application.ascend_android.AscendUser
import com.google.gson.JsonObject
import kotlin.collections.arrayListOf
import java.util.HashMap

@ReactModule(name = AscendReactNativeSdkModule.NAME)
class AscendReactNativeSdkModule(reactContext: ReactApplicationContext) :
  NativeAscendReactNativeSdkSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun init(config: ReadableMap, promise: Promise) {
    Log.d(NAME, "init called with config: $config")

    try {
      val httpConfigMap = config.getMap("httpConfig")
      if (httpConfigMap == null) {
        val result = Arguments.createMap()
        result.putBoolean("success", false)
        result.putString("error", "httpConfig is required")
        promise.resolve(result)
        return
      }

      val apiBaseUrl = httpConfigMap.getString("apiBaseUrl") ?: ""
      val shouldRetry = if (httpConfigMap.hasKey("shouldRetry") && !httpConfigMap.isNull("shouldRetry")) {
        httpConfigMap.getBoolean("shouldRetry")
      } else {
        false
      }

      val retrialConfigMap = httpConfigMap.getMap("retrialConfig")
      val retrialAttempts = retrialConfigMap?.getInt("attempts") ?: 3
      val delayMap = retrialConfigMap?.getMap("delay")
      val delayTime = delayMap?.getInt("time") ?: 1000
      val delayPolicy = delayMap?.getString("policy") ?: "LINEAR"
      val timeoutConfigMap = httpConfigMap.getMap("timeoutConfig")
      val callTimeout = timeoutConfigMap?.getInt("callTimeout") ?: 30000
      
      val headersReadableMap = httpConfigMap.getMap("headers")
      val headersMap = HashMap<String, String>()
      
      if (headersReadableMap != null) {
        val iterator = headersReadableMap.keySetIterator()
        while (iterator.hasNextKey()) {
          val key = iterator.nextKey()
          val value = headersReadableMap.getString(key)
          if (value != null) {
            headersMap[key] = value
          }
        }
      }
      
      val httpConfig = HttpConfig(
        headers = headersMap,
        apiBaseUrl = apiBaseUrl,
        shouldRetry = shouldRetry,
        fetchInterval = 1000L,
        retrialConfig = RetrialConfig(
          attempts = retrialAttempts,
          delay = Delay(time = delayTime * 1L, policy = RetryPolicy.valueOf(delayPolicy))
        ),
        timeOutConfig = TimeoutConfig(
          callTimeout = callTimeout * 1L,
          shouldEnableLogging = true
        )
      )

      val clientConfigMap = config.getMap("clientConfig")
      val apiKey = clientConfigMap?.getString("apiKey") ?: ""
      val userId = clientConfigMap?.getString("userId") ?: ""

      val pluginsArray = config.getArray("plugins")
      val pluginConfigs = arrayListOf<PluginConfig>()
      
      if (pluginsArray != null) {
        for (i in 0 until pluginsArray.size()) {
          val pluginMap = pluginsArray.getMap(i)
          val pluginName = pluginMap?.getString("name") ?: continue
          
          Log.d(NAME, "Processing Plugin $i - name: $pluginName")
          
          if (pluginName == "EXPERIMENTS") {
            val pluginConfigMap = pluginMap.getMap("config")
            val shouldFetchOnInit = pluginConfigMap?.getBoolean("shouldFetchOnInit") ?: false
            val shouldRefreshDRSOnForeground = pluginConfigMap?.getBoolean("shouldRefreshDRSOnForeground") ?: false
            val defaultValuesMap = pluginConfigMap?.getMap("defaultValues")
            val defaultMap = HashMap<String, JsonObject?>()

            if (defaultValuesMap != null) {
              val iterator = defaultValuesMap.keySetIterator()
              while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                
                val valueMap = defaultValuesMap.getMap(key)
                
                if (valueMap != null) {
                  val jsonObject = JsonObject()
                  val valueIterator = valueMap.keySetIterator()
                  
                  while (valueIterator.hasNextKey()) {
                    val valueKey = valueIterator.nextKey()
                    val valueType = valueMap.getType(valueKey)
                    when (valueType) {
                      com.facebook.react.bridge.ReadableType.Boolean -> {
                        val boolValue = valueMap.getBoolean(valueKey)
                        jsonObject.addProperty(valueKey, boolValue)
                      }
                      com.facebook.react.bridge.ReadableType.Number -> {
                        val numValue = valueMap.getDouble(valueKey)
                        jsonObject.addProperty(valueKey, numValue)
                      }
                      com.facebook.react.bridge.ReadableType.String -> {
                        val strValue = valueMap.getString(valueKey)
                        jsonObject.addProperty(valueKey, strValue)
                      } 
                      else -> {
                        Log.w(NAME, "    Unsupported type for $valueKey: $valueType")
                      }
                    }
                  }
                  
                  defaultMap[key] = jsonObject
                  Log.d(NAME, "Final JsonObject for experiment '$key': $jsonObject")
                }
              }
            }

            Log.d(NAME, "  httpConfig: $httpConfig")
            
            val experimentConfig: ExperimentConfig =
              ExperimentConfig.Builder(object : IExperimentCallback {
                override fun onFailure(throwable: Throwable) {
                  Log.e(NAME, "Experiments initialization failed: ${throwable.message}", throwable)
                }

                override fun onSuccess() {
                  Log.d(NAME, "Experiments initialized successfully")
                }
              })
              .defaultValues(defaultMap)
              .shouldFetchOnInit(shouldFetchOnInit)
              .httpConfig(httpConfig)
              .shouldRefreshDRSOnForeground(shouldRefreshDRSOnForeground)
              .build()
      
            pluginConfigs.add(PluginConfig(::DRSPlugin, Plugins.EXPERIMENTS.pluginName, experimentConfig))
          }
        }
      }

      val ascendConfig = AscendConfig(
        httpConfig,
        plugins = pluginConfigs,
        clientConfig = ClientConfig(apiKey = apiKey)
      )

      Ascend.init(ascendConfig, reactApplicationContext)
      
      // Only set userId if provided and not empty
      if (userId.isNotEmpty()) {
        Log.d(NAME, "Setting userId: '$userId'")
        AscendUser.setUser(userId)
      } else {
        Log.d(NAME, "No userId provided, skipping setUser")
      }
      
      val result = Arguments.createMap()
      result.putBoolean("success", true)
      result.putString("message", "Initialization successful")
      promise.resolve(result)

    } catch (e: Exception) {
      Log.e(NAME, "Error in init: ${e.message}", e)
      e.printStackTrace()
      val result = Arguments.createMap()
      result.putBoolean("success", false)
      result.putString("error", "Failed to initialize: ${e.message}")
      promise.resolve(result)
    }
  }

  override fun isInitialized(promise: Promise) {
    try {
      val isInitialized = Ascend.isAscendInitialised();
      
      Log.d(NAME, "Ascend initialized status: $isInitialized")
      promise.resolve(isInitialized)
    } catch (e: Exception) {
      Log.e(NAME, "Error in isInitialized: ${e.message}", e)
      promise.reject("ERROR", "Failed to check initialization status: ${e.message}", e)
    }
  }

  override fun setUser(userId: String, promise: Promise) {
    if (!Ascend.isAscendInitialised()) {
      promise.resolve(false)
      return
    }
    try {
      AscendUser.setUser(userId)
      promise.resolve(true)
    } catch (e: Exception) {
      Log.e(NAME, "Error in setUser: ${e.message}", e)
      promise.reject("ERROR", "Failed to set user: ${e.message}", e)
    }
  }
  
  override fun getUserId(promise: Promise) {
    if (!Ascend.isAscendInitialised()) {
      promise.resolve("")
      return
    }
    try {
      val userId = AscendUser.userId
      Log.d(NAME, "getUserId result: $userId")
      promise.resolve(userId ?: "")
    } catch (e: Exception) {
      Log.e(NAME, "Error in getUserId: ${e.message}", e)
      promise.resolve("")
    }
  }
  
  override fun getStringFlag(experimentKey: String, variable: String, dontCache: Boolean, ignoreCache: Boolean, promise: Promise) {
    if (!Ascend.isAscendInitialised() || experimentKey.isEmpty() || variable.isEmpty()) {
      Log.d(NAME, "getStringFlag failed: Invalid input or SDK not initialized")
      promise.resolve("")
      return
    }
    try {
      Log.d(NAME, "getStringFlag called - experimentKey: $experimentKey, variable: $variable, dontCache: $dontCache, ignoreCache: $ignoreCache")
      
      val experimentPlugin = Ascend.getPlugin<DRSPlugin>(Plugins.EXPERIMENTS)
      val result = experimentPlugin.getExperimentService().getStringFlag(experimentKey, variable, dontCache, ignoreCache)
      
      Log.d(NAME, "getStringFlag result: $result")
      promise.resolve(result ?: "")
    } catch (e: Exception) {
      Log.e(NAME, "Error in getStringFlag: ${e.message}", e)
      promise.resolve("")
    }
  }

  override fun getBooleanFlag(experimentKey: String, variable: String, dontCache: Boolean, ignoreCache: Boolean, promise: Promise) {
    if (!Ascend.isAscendInitialised() || experimentKey.isEmpty() || variable.isEmpty()) {
      Log.d(NAME, "getBooleanFlag failed: Invalid input or SDK not initialized")
      promise.resolve(false)
      return
    }
    try {
      val experimentPlugin = Ascend.getPlugin<DRSPlugin>(Plugins.EXPERIMENTS)
      val result = experimentPlugin.getExperimentService().getBooleanFlag(experimentKey, variable, dontCache, ignoreCache)
      
      Log.d(NAME, "getBooleanFlag result: $result")
      promise.resolve(result)
    } catch (e: Exception) {
      Log.e(NAME, "Error in getBooleanFlag: ${e.message}", e)
      promise.resolve(false)
    }
  }

  override fun getNumberFlag(experimentKey: String, variable: String, dontCache: Boolean, ignoreCache: Boolean, promise: Promise) {
    if (!Ascend.isAscendInitialised() || experimentKey.isEmpty() || variable.isEmpty()) {
      promise.resolve(-1)
      return
    }
    try {
      val experimentPlugin = Ascend.getPlugin<DRSPlugin>(Plugins.EXPERIMENTS)
      val result = experimentPlugin.getExperimentService().getDoubleFlag(experimentKey, variable, dontCache, ignoreCache)
      
      Log.d(NAME, "getNumberFlag result: $result")
      promise.resolve(result)
    } catch (e: Exception) {
      Log.e(NAME, "Error in getNumberFlag: ${e.message}", e)
      promise.resolve(-1)
    }
  }

  override fun getAllVariables(experimentKey: String, promise: Promise) {
    if (!Ascend.isAscendInitialised() || experimentKey.isEmpty()) {
      Log.d(NAME, "getAllVariables failed: SDK not initialized or empty key")
      promise.resolve("")
      return
    }
    try {
      val experimentPlugin = Ascend.getPlugin<DRSPlugin>(Plugins.EXPERIMENTS)
      val result = experimentPlugin.getExperimentService().getAllVariables(experimentKey)
      
      val jsonString = result?.toString() ?: ""
      
      Log.d(NAME, "getAllVariables result: $jsonString")
      promise.resolve(jsonString)
    } catch (e: Exception) {
      Log.e(NAME, "Error in getAllVariables: ${e.message}", e)
      promise.resolve("")
    }
  }

  override fun initializeExperiments(promise: Promise) {
    if (!Ascend.isAscendInitialised()) {
      promise.resolve(false)
      return
    }
    try {
      val experimentPlugin = Ascend.getPlugin<DRSPlugin>(Plugins.EXPERIMENTS)
      Log.d(NAME, "Experiments plugin initialized successfully: $experimentPlugin")
      
      promise.resolve(true)
    } catch (e: Exception) {
      Log.e(NAME, "Error in initializeExperiments: ${e.message}", e)
      promise.reject("ERROR", "Failed to initialize experiments: ${e.message}", e)
    }
  }

  override fun refreshExperiment(promise: Promise) {
    if (!Ascend.isAscendInitialised()) {
      promise.resolve(false)
      return
    }
    try {
      val experimentPlugin = Ascend.getPlugin<DRSPlugin>(Plugins.EXPERIMENTS)
      val callback = object : IExperimentCallback {
        override fun onFailure(throwable: Throwable) {
          Log.e(NAME, "refreshExperiment failed: ${throwable.message}", throwable)
          promise.resolve(false)
        }
        
        override fun onSuccess() {
          Log.d(NAME, "refreshed experiments successfully")
          promise.resolve(true)
        }
      }
      
      experimentPlugin.getExperimentService().refreshExperiment(callback)
    } catch (e: Exception) {
      Log.e(NAME, "Error in refreshExperiment: ${e.message}", e)
      promise.reject("ERROR", "Failed to refresh experiments: ${e.message}", e)
    }
  }

  override fun fetchExperiments(defaultValues: ReadableMap, promise: Promise) {
    if (!Ascend.isAscendInitialised()) {
      Log.d(NAME, "fetchExperiments failed: SDK not initialized")
      promise.resolve(false)
      return
    }
    try {
      Log.d(NAME, "fetchExperiments called with defaultValues: $defaultValues")
      
      val experimentPlugin = Ascend.getPlugin<DRSPlugin>(Plugins.EXPERIMENTS)
      
      val defaultMap = HashMap<String, JsonObject?>()
      val iterator = defaultValues.keySetIterator()
      while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        
        val valueMap = defaultValues.getMap(key)
        
        if (valueMap != null) {
          val jsonObject = JsonObject()
          val valueIterator = valueMap.keySetIterator()
          
          while (valueIterator.hasNextKey()) {
            val valueKey = valueIterator.nextKey()
            val valueType = valueMap.getType(valueKey)
            
            when (valueType) {
              com.facebook.react.bridge.ReadableType.Boolean -> {
                val boolValue = valueMap.getBoolean(valueKey)
                jsonObject.addProperty(valueKey, boolValue)
              }
              com.facebook.react.bridge.ReadableType.Number -> {
                val numValue = valueMap.getDouble(valueKey)
                jsonObject.addProperty(valueKey, numValue)
              }
              com.facebook.react.bridge.ReadableType.String -> {
                val strValue = valueMap.getString(valueKey)
                jsonObject.addProperty(valueKey, strValue)
              }
              else -> {
                Log.w(NAME, "    Unsupported type for $valueKey: $valueType")
              }
            }
          }
          
          defaultMap[key] = jsonObject
          Log.d(NAME, "Final JsonObject for experiment '$key': $jsonObject")
        }
      }
      
      val callback = object : IExperimentCallback {
        override fun onFailure(throwable: Throwable) {
          Log.e(NAME, "fetchExperiments failed: ${throwable.message}", throwable)
          promise.reject("ERROR", "Failed to fetch experiments: ${throwable.message}", throwable)
        }
        
        override fun onSuccess() {
          Log.d(NAME, "fetched experiments successfully")
          promise.resolve(true)
        }
      }
      
      experimentPlugin.getExperimentService().fetchExperiments(defaultMap, callback)
    } catch (e: Exception) {
      Log.e(NAME, "Error in fetchExperiments: ${e.message}", e)
      promise.reject("ERROR", "Failed to fetch experiments: ${e.message}", e)
    }
  }

  override fun getExperimentVariants(promise: Promise) {
    try {
      val experimentPlugin = Ascend.getPlugin<DRSPlugin>(Plugins.EXPERIMENTS)
      val res = experimentPlugin.getExperimentService().getExperimentVariants()
      
      if (res == null || res.isEmpty()) {
        Log.d(NAME, "getExperimentVariants: No experiments in storage")
        promise.resolve("{}")
        return
      }
      
      val jsonString = com.google.gson.Gson().toJson(res)
      
      Log.d(NAME, "getExperimentVariants result: $jsonString")
      promise.resolve(jsonString)
    } catch (e: Exception) {
      Log.e(NAME, "getExperimentVariants exception: ${e.message}", e)
      e.printStackTrace()
      promise.resolve("{}")
    }
  }

  companion object {
    const val NAME = "AscendReactNativeSdk"
  }
}
