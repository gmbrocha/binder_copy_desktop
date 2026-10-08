#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface BinderCopySystem : NSObject <RCTBridgeModule>
@end

@implementation BinderCopySystem
RCT_EXPORT_MODULE();
+ (BOOL)requiresMainQueueSetup { return NO; }
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(uuid) {
  return [NSUUID UUID].UUIDString.lowercaseString;
}
@end
