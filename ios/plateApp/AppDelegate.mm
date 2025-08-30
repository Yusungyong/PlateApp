#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <GoogleMaps/GoogleMaps.h>

// ⛔️ @import Firebase;  // 제거
// ✅ 헤더로 임포트
#import <FirebaseCore/FirebaseCore.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate () <UNUserNotificationCenterDelegate>
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Google Maps API 키 (가능하면 Info.plist에서 읽어오기 권장)
  [GMSServices provideAPIKey:@"<YOUR_IOS_MAPS_API_KEY>"];

  // ✅ Firebase 기본 앱 초기화 (중복 호출 방지)
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  // (선택) iOS 10+ 포그라운드 알림 표시를 원할 때
  if (@available(iOS 10.0, *)) {
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  }

  self.moduleName = @"plateApp";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// (선택) 포그라운드 알림 표시
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler API_AVAILABLE(ios(10.0))
{
  if (@available(iOS 14.0, *)) {
    completionHandler(UNNotificationPresentationOptionBanner |
                      UNNotificationPresentationOptionList |
                      UNNotificationPresentationOptionSound |
                      UNNotificationPresentationOptionBadge);
  } else {
    completionHandler(UNNotificationPresentationOptionAlert |
                      UNNotificationPresentationOptionSound |
                      UNNotificationPresentationOptionBadge);
  }
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge { return [self bundleURL]; }

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
