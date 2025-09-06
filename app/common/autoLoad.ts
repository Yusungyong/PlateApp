// src/icons/autoLoad.ts
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// 한 번만 실행되면 됨(중복 호출 안전)
Ionicons.loadFont();
MaterialIcons.loadFont();