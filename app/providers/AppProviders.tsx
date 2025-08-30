// app/providers/AppProviders.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from 'react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootEffects from './RootEffects';
import queryClient from './QueryClient';
import store from '../../src/redux/store';

/**
 * 전역 Provider 합성: Redux, React Query, Gesture Root
 * - AuthProvider는 NavigationContainer 내부에서 사용하므로 여기서는 포함하지 않음
 */
const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/* 전역 사이드 이펙트 */}
          <RootEffects />
          {children}
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Provider>
  );
};

export default AppProviders;
