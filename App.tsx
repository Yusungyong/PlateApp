// App.tsx
import 'react-native-reanimated'; // Entry 최상단 유지
import React from 'react';
import AppProviders from './app/providers/AppProviders';
import AppNavigationContainer from './app/navigation/AppNavigationContainer';

const App: React.FC = () => {
  return (
    <AppProviders>
      <AppNavigationContainer />
    </AppProviders>
  );
};

export default App;
