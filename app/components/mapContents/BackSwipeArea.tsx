// components/MapView/Controls/BackSwipeArea.tsx
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const BackSwipeArea = () => {
  const navigation = useNavigation();

  const handleSwipe = useCallback((event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END && event.nativeEvent.translationX > 50) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <PanGestureHandler onHandlerStateChange={handleSwipe}>
      <View style={styles.swipeArea} />
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  swipeArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 50,
    backgroundColor: 'transparent',
  },
});

export default BackSwipeArea;
