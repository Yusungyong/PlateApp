import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, Platform, UIManager, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApiService } from '../../../services/api/apiService';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 메뉴 타이틀별 2차배열 변환
const groupMenusByTitle = (menus) => {
  const groups = {};
  menus.forEach((menu) => {
    const title = menu.menuTitle || '기타 메뉴 정보';
    if (!groups[title]) groups[title] = [];
    groups[title].push(menu);
  });
  return Object.keys(groups).map((title) => ({
    title,
    items: groups[title],
  }));
};

// 가격 포맷 함수
const getFormattedPrice = (price) => {
  if (!price) return '가격문의';
  if (typeof price === 'number') {
    return `${price.toLocaleString()}원`;
  }
  if (/^\d+$/.test(price)) {
    return `${parseInt(price, 10).toLocaleString()}원`;
  }
  return price;
};

// 아코디언(애니메이션) 섹션
const AnimatedAccordion = ({ open, children }) => {
  const animatedHeight = React.useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(null);

  const onLayout = (e) => {
    const h = e.nativeEvent.layout.height;
    if (!contentHeight && h > 0) setContentHeight(h);
  };

  useEffect(() => {
    if (contentHeight !== null) {
      if (open) {
        Animated.timing(animatedHeight, {
          toValue: contentHeight,
          duration: 330,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 220,
          useNativeDriver: false,
        }).start();
      }
    }
  }, [open, contentHeight]);

  // 처음엔 auto, 이후엔 height로!
  if (contentHeight === null) {
    return (
      <View onLayout={onLayout}>
        {open ? children : null}
      </View>
    );
  }
  return (
    <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
      {children}
    </Animated.View>
  );
};


const StoreMenuSection = ({ placeId, storeName }) => {
  const { apiCall } = useApiService();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openedSections, setOpenedSections] = useState({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    apiCall({
      method: 'POST',
      url: '/get-feed-menu',
      data: { placeId, storeName },
    })
      .then(res => { if (isMounted) setMenu(res || []); })
      .catch(e => { if (isMounted) setError(e); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [placeId, storeName, apiCall]);

  const groupedMenus = useMemo(() => groupMenusByTitle(menu), [menu]);

  const toggleSection = (title) => {
    setOpenedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="small" color="#FDA085" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerBox}>
        <Text style={{ color: '#e74c3c', fontSize: 15 }}>메뉴 불러오기 실패</Text>
      </View>
    );
  }

  if (!groupedMenus || groupedMenus.length === 0) {
    return (
      <View style={styles.centerBox}>
        <Text style={{ color: '#bbb', fontSize: 15 }}>등록된 메뉴가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 8 }}>
      {groupedMenus.map((section, idx) => (
        <View key={section.title + idx} style={styles.sectionContainer}>
          <TouchableOpacity
            style={[
              styles.sectionHeader,
              openedSections[section.title] && styles.sectionHeaderOpen,
            ]}
            onPress={() => toggleSection(section.title)}
            activeOpacity={0.82}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name="local-drink"
                size={20}
                color={openedSections[section.title] ? "#FDA085" : "#bbb"}
                style={{ marginRight: 7 }}
              />
              <Text
                style={[
                  styles.sectionTitle,
                  openedSections[section.title] && { color: '#FDA085' }
                ]}
              >
                {section.title}
              </Text>
            </View>
            <Icon
              name={openedSections[section.title] ? "expand-less" : "expand-more"}
              size={24}
              color={openedSections[section.title] ? "#FDA085" : "#bbb"}
            />
          </TouchableOpacity>
          <AnimatedAccordion open={!!openedSections[section.title]} style={styles.menuList}>
            {section.items.map((item, i) => (
              <View style={styles.menuCard} key={item.menuName + i}>
                <View style={styles.menuContent}>
                  <Text
                    style={styles.menuName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.menuName}
                  </Text>
                  <Text
                    style={item.price ? styles.menuPrice : styles.menuNoPrice}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {getFormattedPrice(item.price)}
                  </Text>
                </View>
              </View>
            ))}
          </AnimatedAccordion>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  centerBox: {
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#aaa',
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 9,
    elevation: 2,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9fa',
    paddingHorizontal: 32,
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeaderOpen: {
    backgroundColor: '#FFF6F0',
    borderBottomColor: '#FDA085',
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 0.5,
  },
  menuList: {
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    paddingBottom: 6,
    paddingTop: 3,
  },
  menuCard: {
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuName: {
    fontSize: 15.5,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  menuPrice: {
    fontSize: 15.5,
    color: '#FDA085',
    fontWeight: 'bold',
    marginLeft: 12,
    minWidth: 60,
    maxWidth: 110,
    textAlign: 'right',
  },
  menuNoPrice: {
    fontSize: 15.5,
    color: '#bbb',
    fontStyle: 'italic',
    marginLeft: 12,
    minWidth: 60,
    maxWidth: 110,
    textAlign: 'right',
  },
});

export default StoreMenuSection;
