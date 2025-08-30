import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomRadioButton from './CustomRadioButton';
import { useNavigation } from '@react-navigation/native';
import { useFeedSearchFilter } from './useFeedSearchFilter';
import { useSaveFeedSearchFilter } from './useSaveFeedSearchFilter';
import CommonLayout from '../../../../common/CommonLayout';

const FeedFilterSettings = () => {
  const navigation = useNavigation();

  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedImage, setSelectedImage] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedSorting, setSelectedSorting] = useState('latest');

  const { searchFilter } = useFeedSearchFilter({
    username: 'su12ng',
    filterType: 'feed',
    imageYn: 'ALL',
    timeFilter: 'ALL',
    regionFilter: 'ALL',
    postSorted: 'NEWPOST',
    postSource: 'ALL',
  });

  const { saveSearchFilter } = useSaveFeedSearchFilter();

  useEffect(() => {
    if (searchFilter) {
      setSelectedLocation(mapRegion(searchFilter.regionFilter));
      setSelectedImage(mapImage(searchFilter.imageYn));
      setSelectedTime(mapTime(searchFilter.timeFilter));
      setSelectedSource(mapSource(searchFilter.postSource));
      setSelectedSorting(mapSorting(searchFilter.postSorted));
    }
  }, [searchFilter]);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('feedLocationCriteria', selectedLocation);
      await AsyncStorage.setItem('feedImageCriteria', selectedImage);
      await AsyncStorage.setItem('feedTimeRange', selectedTime);
      await AsyncStorage.setItem('feedPostSource', selectedSource);
      await AsyncStorage.setItem('feedSortingCriteria', selectedSorting);

      await saveSearchFilter({
        username: 'su12ng',
        filterType: 'feed',
        imageYn: reverseMapImage(selectedImage),
        timeFilter: reverseMapTime(selectedTime),
        regionFilter: reverseMapRegion(selectedLocation),
        postSorted: reverseMapSorting(selectedSorting),
        postSource: reverseMapSource(selectedSource),
      });

      Alert.alert(
        '성공',
        '필터 설정이 저장되었습니다.',
        [
          {
            text: '확인',
            onPress: () => navigation.navigate('홈'), // 실제 route name에 맞게 변경 필요
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('설정 저장 오류:', error);
      Alert.alert('오류', '설정 저장에 실패했습니다.');
    }
  };

  const renderRadioGroup = (options, selectedValue, setSelectedValue) => (
    <View style={styles.radioGroup}>
      {options.map(option => (
        <View key={option.value} style={styles.radioItem}>
          <CustomRadioButton
            label={option.label}
            value={option.value}
            selected={selectedValue === option.value}
            onPress={setSelectedValue}
          />
        </View>
      ))}
    </View>
  );

  const locationOptions = [
    { label: '활동지역', value: 'activeRegion' },
    { label: '내 위치 주변', value: 'aroundMe' },
    { label: '전체', value: 'all' },
  ];

  const imageOptions = [
    { label: '이미지 있음', value: 'withImage' },
    { label: '이미지 없음', value: 'withoutImage' },
    { label: '전체', value: 'all' },
  ];

  const timeOptions = [
    { label: '1일 이내', value: '1day' },
    { label: '1달 이내', value: '1month' },
    { label: '3달 이내', value: '3months' },
    { label: '6개월 이내', value: '6months' },
    { label: '1년 이내', value: '1year' },
    { label: '전체', value: 'all' },
  ];

  const sourceOptions = [
    { label: '내 게시글', value: 'mine' },
    { label: '친구 게시글', value: 'friends' },
    { label: '전체 게시글', value: 'all' },
  ];

  const sortingOptions = [
    { label: '최신순', value: 'latest' },
    { label: '오래된 순', value: 'oldest' },
    { label: '좋아요 많은 순', value: 'mostLiked' },
  ];

  const mapRegion = val => val === 'ACTIVE_PLACE' ? 'activeRegion' : val === 'MY_PLACE' ? 'aroundMe' : 'all';
  const mapImage = val => val === 'Y' ? 'withImage' : val === 'N' ? 'withoutImage' : 'all';
  const mapTime = val => val.toLowerCase();
  const mapSource = val => val === 'MYPOST' ? 'mine' : val === 'FRIENDPOST' ? 'friends' : 'all';
  const mapSorting = val => val === 'NEWPOST' ? 'latest' : val === 'OLDPOST' ? 'oldest' : 'mostLiked';

  const reverseMapRegion = val => val === 'activeRegion' ? 'ACTIVE_PLACE' : val === 'aroundMe' ? 'MY_PLACE' : 'ALL';
  const reverseMapImage = val => val === 'withImage' ? 'Y' : val === 'withoutImage' ? 'N' : 'ALL';
  const reverseMapTime = val => val.toUpperCase();
  const reverseMapSource = val => val === 'mine' ? 'MYPOST' : val === 'friends' ? 'FRIENDPOST' : 'ALL';
  const reverseMapSorting = val => val === 'latest' ? 'NEWPOST' : val === 'oldest' ? 'OLDPOST' : 'LIKEPOST';

  return (
    <CommonLayout>
      <View style={styles.container}>
        <Text style={styles.title}>피드 필터 설정</Text>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>피드 표시 기준</Text>
          {renderRadioGroup(locationOptions, selectedLocation, setSelectedLocation)}
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>이미지 필터</Text>
          {renderRadioGroup(imageOptions, selectedImage, setSelectedImage)}
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>시간 범위</Text>
          {renderRadioGroup(timeOptions, selectedTime, setSelectedTime)}
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>게시글 출처</Text>
          {renderRadioGroup(sourceOptions, selectedSource, setSelectedSource)}
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>정렬 기준</Text>
          {renderRadioGroup(sortingOptions, selectedSorting, setSelectedSorting)}
        </View>

        <Button title="저장" onPress={handleSave} />
      </View>
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterRow: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioItem: {
    width: '33.33%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
});

export default FeedFilterSettings;
