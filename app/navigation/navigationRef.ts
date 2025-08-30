// appComponents/navigationRef.ts
import {
  createNavigationContainerRef,
  NavigationContainerRefWithCurrent,
} from '@react-navigation/native';

// 라우트 타입 선언이 있다면 교체
type RootParamList = Record<string, object | undefined>;

export const navigationRef: NavigationContainerRefWithCurrent<RootParamList> =
  createNavigationContainerRef<RootParamList>();

// NavigationContainer 준비 여부
export const navReady = { current: false };

// 준비 전 네비 요청 보류 큐
let pendingRoutes: Array<() => void> = [];

/** Navigation이 준비되면 보류된 요청을 모두 처리 */
export function flushPending() {
  if (!navReady.current || !navigationRef.isReady()) return;
  const tasks = [...pendingRoutes];
  pendingRoutes = [];
  tasks.forEach((t) => {
    try {
      t();
    } catch (e) {
      if (__DEV__) console.warn('navigateSafely task failed:', e);
    }
  });
}

/** Navigation 준비 전이면 큐에 쌓고, 준비되면 즉시 실행 */
export function navigateSafely(task: () => void) {
  if (navReady.current && navigationRef.isReady()) task();
  else pendingRoutes.push(task);
}

/** 외부에서 간편 호출용 navigate (Login 등) */
export function navigate<Name extends keyof RootParamList>(
  name: Name,
  params?: RootParamList[Name],
) {
  navigateSafely(() => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name as any, params as any);
    }
  });
}
