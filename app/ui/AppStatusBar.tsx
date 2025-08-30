// app/ui/AppStatusBar.tsx
import React from 'react';
import { Platform, StatusBar } from 'react-native';

const AppStatusBar: React.FC = () => {
  return (
    <StatusBar
      barStyle="dark-content"
      hidden={false}
      backgroundColor={Platform.OS === 'android' ? '#fff' : undefined}
    />
  );
};

export default AppStatusBar;
