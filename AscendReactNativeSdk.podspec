require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "AscendReactNativeSdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/dream11/ascend-react-native/react-native-ascend-react-native-sdk.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,cpp,swift}"
  s.private_header_files = "ios/**/*.h"
  
  # Swift configuration
  s.swift_version = '5.7'
  # Note: Bridging headers are not supported with framework targets
  # We don't need one since we're calling Swift from Objective-C, not the other way around
  # The auto-generated Swift header (AscendReactNativeSdk-Swift.h) will be created automatically

  # Dependencies
  # Note: The Ascend dependency source must be specified in the Podfile
  # CocoaPods doesn't allow :git in podspec dependencies
  s.dependency 'Ascend'

  install_modules_dependencies(s)
end
