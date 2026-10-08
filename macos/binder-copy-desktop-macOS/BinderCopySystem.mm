#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <Security/Security.h>

@interface BinderCopySystem : NSObject <RCTBridgeModule>
@end

@implementation BinderCopySystem
RCT_EXPORT_MODULE();
+ (BOOL)requiresMainQueueSetup { return NO; }
- (NSDictionary *)constantsToExport {
  NSBundle *bundle = NSBundle.mainBundle;
  return @{ @"apiURL": [bundle objectForInfoDictionaryKey:@"BinderCopyAPIURL"] ?: @"",
            @"authURL": [bundle objectForInfoDictionaryKey:@"BinderCopyAuthURL"] ?: @"",
            @"publishableKey": [bundle objectForInfoDictionaryKey:@"BinderCopyPublishableKey"] ?: @"" };
}
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(uuid) {
  return [NSUUID UUID].UUIDString.lowercaseString;
}
- (NSMutableDictionary *)queryForKey:(NSString *)key {
  return [@{ (__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
             (__bridge id)kSecAttrService: @"com.clearpathsystems.bindercopy.auth",
             (__bridge id)kSecAttrAccount: key,
             (__bridge id)kSecUseDataProtectionKeychain: @YES } mutableCopy];
}
RCT_EXPORT_METHOD(getSecret:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSMutableDictionary *query = [self queryForKey:key];
  query[(__bridge id)kSecReturnData] = @YES;
  query[(__bridge id)kSecMatchLimit] = (__bridge id)kSecMatchLimitOne;
  CFTypeRef result = NULL;
  OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)query, &result);
  if (status == errSecItemNotFound) { resolve([NSNull null]); return; }
  if (status != errSecSuccess) { reject(@"keychain_read", @"Secure storage is unavailable.", nil); return; }
  NSData *data = CFBridgingRelease(result);
  NSString *value = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  if (!value) { reject(@"keychain_decode", @"Stored session could not be read.", nil); return; }
  resolve(value);
}
RCT_EXPORT_METHOD(setSecret:(NSString *)key value:(NSString *)value resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSMutableDictionary *query = [self queryForKey:key];
  NSDictionary *attributes = @{ (__bridge id)kSecValueData: [value dataUsingEncoding:NSUTF8StringEncoding] };
  OSStatus status = SecItemUpdate((__bridge CFDictionaryRef)query, (__bridge CFDictionaryRef)attributes);
  if (status == errSecItemNotFound) {
    [query addEntriesFromDictionary:attributes];
    query[(__bridge id)kSecAttrAccessible] = (__bridge id)kSecAttrAccessibleWhenUnlockedThisDeviceOnly;
    status = SecItemAdd((__bridge CFDictionaryRef)query, NULL);
  }
  if (status != errSecSuccess) { reject(@"keychain_write", @"Session could not be stored securely.", nil); return; }
  resolve([NSNull null]);
}
RCT_EXPORT_METHOD(removeSecret:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  OSStatus status = SecItemDelete((__bridge CFDictionaryRef)[self queryForKey:key]);
  if (status != errSecSuccess && status != errSecItemNotFound) { reject(@"keychain_delete", @"Stored session could not be removed.", nil); return; }
  resolve([NSNull null]);
}
@end
