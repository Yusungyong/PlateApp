import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserInfoHeader from './UserInfoHeader';
import PlaceInfoHeader from './PlaceInfoHeader';

const FeedItemHeader = ({ feedData, currentUser, onModalOpen }) => {
  return (
    <View style={styles.header}>
      <UserInfoHeader
        feedData={feedData}
        currentUser={currentUser}
        onModalOpen={onModalOpen} // → 여기 전달됨
      />
      <PlaceInfoHeader feedData={feedData} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    margin: 10,
  },
});

export default FeedItemHeader;
