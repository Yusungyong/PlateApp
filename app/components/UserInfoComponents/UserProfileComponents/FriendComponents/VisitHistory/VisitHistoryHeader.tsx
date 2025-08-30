import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { profileBucket } from '../../../../../config/config';

const VisitHistoryHeader = ({
  friendProfileImageUrl,
  friendName,
  visitData = [],
}) => {
  const [myProfileUrl, setMyProfileUrl] = useState(null);
  const [sinceDate, setSinceDate] = useState('');
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const loadMyProfileImage = async () => {
      const url = await AsyncStorage.getItem('profileImageUrl');
      if (url) setMyProfileUrl(`${profileBucket}${url}`);
    };

    const findOldestVisitDate = () => {
      if (visitData.length === 0) return;
      const sorted = [...visitData].sort(
        (a, b) => new Date(a.visitDate) - new Date(b.visitDate)
      );
      const oldestDate = new Date(sorted[0].visitDate);
      setSinceDate(
        `${oldestDate.getFullYear()}년 ${oldestDate.getMonth() + 1}월 ${oldestDate.getDate()}일 이후`
      );
      setVisitCount(visitData.length);
    };

    loadMyProfileImage();
    findOldestVisitDate();
  }, [visitData]);

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <FastImage
          source={{ uri: myProfileUrl }}
          style={[styles.profileImage, styles.myProfile]}
          resizeMode={FastImage.resizeMode.cover}
        />
        <FastImage
          source={{ uri: `${profileBucket}${friendProfileImageUrl}` }}
          style={[styles.profileImage, styles.friendProfile]}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>

      <Text style={styles.nameText}>나와 {friendName}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.sinceText}>{sinceDate}</Text>
        <View style={styles.walkBox}>
          <Ionicons name="footsteps-outline" size={16} color="#FF7F50" />
          <Text style={styles.countText}>방문한 {visitCount}곳</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FF7F50',
    backgroundColor: '#fff',
  },
  myProfile: {
    zIndex: 2,
    marginRight: -15,
  },
  friendProfile: {
    zIndex: 1,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoBox: {
    alignItems: 'center',
    gap: 4,
  },
  sinceText: {
    fontSize: 13,
    color: '#999',
  },
  walkBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
});

export default VisitHistoryHeader;
