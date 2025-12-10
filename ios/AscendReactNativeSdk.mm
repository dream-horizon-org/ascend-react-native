#import "AscendReactNativeSdk.h"
#import "AscendReactNativeSdk-Swift.h"
#import <React/RCTUtils.h>
#import <React/RCTBridgeModule.h>
// Import the generated spec header from React Native codegen
#import <ReactCodegen/AscendReactNativeSdk/AscendReactNativeSdk.h>

@implementation AscendReactNativeSdk

- (void)init:(id)config
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject {
    @try {
        NSDictionary *configDict = nil;
        if ([config isKindOfClass:[NSDictionary class]]) {
            configDict = (NSDictionary *)config;
        } else {
            reject(@"INVALID_ARGUMENT", @"Config must be a dictionary", nil);
            return;
        }
        
        [AscendReactNativeSdkSwift init:configDict completion:^(NSDictionary *result) {
            if (!result) {
                reject(@"UNKNOWN_ERROR", @"No result returned from init", nil);
                return;
            }
            resolve(result);
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)isInitialized:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift isInitializedWithCompletion:^(BOOL result) {
            resolve(@(result));
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)setUser:(NSString *)userId
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift setUser:userId completion:^(BOOL result) {
            resolve(@(result));
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)getUserId:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift getUserIdWithCompletion:^(NSString *result) {
            resolve(result ?: @"");
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)setGuest:(NSString *)guestId
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift setGuest:guestId completion:^(BOOL result) {
            resolve(@(result));
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)getGuestId:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift getGuestIdWithCompletion:^(NSString *result) {
            resolve(result ?: @"");
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)getStringFlag:(NSString *)experimentKey
            variable:(NSString *)variable
           dontCache:(NSNumber *)dontCache
          ignoreCache:(NSNumber *)ignoreCache
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift getStringFlag:experimentKey
                                        variable:variable
                                       dontCache:[dontCache boolValue]
                                     ignoreCache:[ignoreCache boolValue]
                                      completion:^(NSString *result) {
            resolve(result ?: @"");
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)getBooleanFlag:(NSString *)experimentKey
             variable:(NSString *)variable
            dontCache:(NSNumber *)dontCache
           ignoreCache:(NSNumber *)ignoreCache
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift getBooleanFlag:experimentKey
                                         variable:variable
                                        dontCache:[dontCache boolValue]
                                      ignoreCache:[ignoreCache boolValue]
                                       completion:^(BOOL result) {
            resolve(@(result));
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)getNumberFlag:(NSString *)experimentKey
            variable:(NSString *)variable
           dontCache:(NSNumber *)dontCache
          ignoreCache:(NSNumber *)ignoreCache
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift getNumberFlag:experimentKey
                                        variable:variable
                                       dontCache:[dontCache boolValue]
                                     ignoreCache:[ignoreCache boolValue]
                                      completion:^(double result) {
            resolve(@(result));
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)getAllVariables:(NSString *)experimentKey
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift getAllVariables:experimentKey completion:^(NSString *result) {
            resolve(result ?: @"");
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)getExperimentVariants:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift getExperimentVariantsWithCompletion:^(NSString *result) {
            resolve(result ?: @"{}");
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)initializeExperiments:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift initializeExperimentsWithCompletion:^(BOOL result) {
            resolve(@(result));
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)refreshExperiment:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject {
    @try {
        [AscendReactNativeSdkSwift refreshExperimentWithCompletion:^(BOOL result) {
            resolve(@(result));
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (void)fetchExperiments:(id)defaultValues
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
    @try {
        NSDictionary *defaultValuesDict = nil;
        if ([defaultValues isKindOfClass:[NSDictionary class]]) {
            defaultValuesDict = (NSDictionary *)defaultValues;
        } else {
            reject(@"INVALID_ARGUMENT", @"defaultValues must be a dictionary", nil);
            return;
        }
        
        [AscendReactNativeSdkSwift fetchExperiments:defaultValuesDict completion:^(BOOL result) {
            resolve(@(result));
        }];
    } @catch (NSException *exception) {
        reject(@"EXCEPTION", [NSString stringWithFormat:@"Exception: %@", exception.reason ?: @"Unknown exception"], nil);
    }
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAscendReactNativeSdkSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"AscendReactNativeSdk";
}

@end
