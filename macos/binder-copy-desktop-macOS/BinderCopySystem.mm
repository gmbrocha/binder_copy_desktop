#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <Security/Security.h>
#import <AppKit/AppKit.h>
#import <ImageIO/ImageIO.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>

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
RCT_EXPORT_METHOD(pickPhotoPixels:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    panel.title = @"Choose a photo";
    panel.allowedContentTypes = @[UTTypeJPEG, UTTypePNG, UTTypeHEIC, UTTypeWebP];
    panel.allowsMultipleSelection = NO;
    panel.canChooseDirectories = NO;
    [panel beginWithCompletionHandler:^(NSModalResponse response) {
      if (response != NSModalResponseOK || !panel.URL) { resolve([NSNull null]); return; }
      NSURL *url = panel.URL;
      BOOL scoped = [url startAccessingSecurityScopedResource];
      NSNumber *size = nil;
      [url getResourceValue:&size forKey:NSURLFileSizeKey error:nil];
      if (!size || size.unsignedLongLongValue > 10 * 1024 * 1024) {
        if (scoped) [url stopAccessingSecurityScopedResource];
        reject(@"photo_size", @"Choose a photo smaller than 10 MB.", nil); return;
      }
      CGImageSourceRef source = CGImageSourceCreateWithURL((__bridge CFURLRef)url, NULL);
      if (!source) { if (scoped) [url stopAccessingSecurityScopedResource]; reject(@"photo_read", @"This photo could not be read.", nil); return; }
      NSDictionary *props = CFBridgingRelease(CGImageSourceCopyPropertiesAtIndex(source, 0, NULL));
      double pixels = [props[(__bridge id)kCGImagePropertyPixelWidth] doubleValue] * [props[(__bridge id)kCGImagePropertyPixelHeight] doubleValue];
      NSDictionary *options = @{ (__bridge id)kCGImageSourceCreateThumbnailFromImageAlways: @YES, (__bridge id)kCGImageSourceCreateThumbnailWithTransform: @YES, (__bridge id)kCGImageSourceThumbnailMaxPixelSize: @128 };
      CGImageRef image = pixels > 0 && pixels <= 80000000 ? CGImageSourceCreateThumbnailAtIndex(source, 0, (__bridge CFDictionaryRef)options) : NULL;
      CFRelease(source);
      if (scoped) [url stopAccessingSecurityScopedResource];
      if (!image) { reject(@"photo_decode", @"Choose a smaller JPEG, PNG or HEIC photo.", nil); return; }
      size_t width = CGImageGetWidth(image), height = CGImageGetHeight(image);
      NSMutableData *data = [NSMutableData dataWithLength:width * height * 4];
      CGColorSpaceRef space = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
      CGContextRef context = CGBitmapContextCreate(data.mutableBytes, width, height, 8, width * 4, space, kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big);
      CGColorSpaceRelease(space);
      if (!context) { CGImageRelease(image); reject(@"photo_decode", @"This photo could not be decoded.", nil); return; }
      CGContextDrawImage(context, CGRectMake(0, 0, width, height), image);
      CGContextRelease(context); CGImageRelease(image);
      unsigned char *bytes = (unsigned char *)data.mutableBytes;
      NSMutableArray *rgba = [NSMutableArray arrayWithCapacity:data.length];
      for (NSUInteger index = 0; index < data.length; index += 4) {
        unsigned int alpha = bytes[index + 3];
        for (int channel = 0; channel < 3; channel++) [rgba addObject:@(alpha ? MIN(255, bytes[index + channel] * 255 / alpha) : 0)];
        [rgba addObject:@(alpha)];
      }
      resolve(rgba);
    }];
  });
}
RCT_EXPORT_METHOD(saveExport:(NSString *)base64 format:(NSString *)format resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if ((! [format isEqualToString:@"png"] && ![format isEqualToString:@"csv"]) || base64.length > 80000000) { reject(@"export_format", @"Unsupported export.", nil); return; }
  NSData *data = [[NSData alloc] initWithBase64EncodedString:base64 options:0];
  if (!data) { reject(@"export_data", @"Export could not be read.", nil); return; }
  dispatch_async(dispatch_get_main_queue(), ^{
    NSSavePanel *panel = [NSSavePanel savePanel];
    panel.nameFieldStringValue = [@"BinderCopy." stringByAppendingString:format];
    panel.allowedContentTypes = @[[format isEqualToString:@"png"] ? UTTypePNG : UTTypeCommaSeparatedText];
    [panel beginWithCompletionHandler:^(NSModalResponse response) {
      if (response != NSModalResponseOK || !panel.URL) { resolve(@NO); return; }
      BOOL scoped = [panel.URL startAccessingSecurityScopedResource];
      NSError *error = nil;
      BOOL saved = [data writeToURL:panel.URL options:NSDataWritingAtomic error:&error];
      if (scoped) [panel.URL stopAccessingSecurityScopedResource];
      if (!saved) { reject(@"export_write", @"The file could not be saved.", error); return; }
      resolve(@YES);
    }];
  });
}
@end
