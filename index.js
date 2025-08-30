// index.js
import { AppRegistry } from 'react-native';
import { decode as atob, encode as btoa } from 'base-64';

// ✅ RNFirebase 기본 앱 패키지를 먼저 로드 (자동 초기화 보장)
import '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

import App from './App';
import { name as appName } from './app.json';

// jwt-decode용 폴리필 (Hermes엔 atob/btoa 없음)
if (typeof global.atob === 'undefined') global.atob = atob;
if (typeof global.btoa === 'undefined') global.btoa = btoa;

// 백그라운드 메시지 핸들러 (초기화 실패에 대비해 try/catch)
try {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (remoteMessage?.data) {
      console.log('📦 Background FCM payload:', remoteMessage.data);
    }
  });
} catch (e) {
  console.warn('FCM background handler init skipped:', e?.message);
}

AppRegistry.registerComponent(appName, () => App);
