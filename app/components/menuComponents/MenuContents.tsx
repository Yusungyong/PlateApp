import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  UIManager,
  Animated,
  Easing,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApiService } from '../../services/api/apiService';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const groupMenusByTitle = (menus) => {
  const groups = {};
  menus.forEach((menu) => {
    const title = menu.menuTitle || '기타';
    if (!groups[title]) groups[title] = [];
    groups[title].push(menu);
  });
  return Object.keys(groups).map((title) => ({
    title,
    items: groups[title],
  }));
};

const getFormattedPrice = (price) => {
  if (!price) return '가격문의';
  if (typeof price === 'number') return `${price.toLocaleString()}원`;
  if (/^\d+$/.test(price)) return `${parseInt(price, 10).toLocaleString()}원`;
  return price;
};

/**
 * 견고한 아코디언
 * - 히든 측정 뷰로 실제 높이 계산(패딩 포함)
 * - 0 측정 방지: requestAnimationFrame으로 재측정 시도
 * - 열림인데 여전히 높이 0이면, 일단 내용은 보이도록 fallback(auto 렌더)
 * - height + opacity + translateY 애니메이션
 * - style prop 적용
 */
const AnimatedAccordion = ({ open, children, style }) => {
  const progress = React.useRef(new Animated.Value(open ? 1 : 0)).current;
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);
  const [measuredOnce, setMeasuredOnce] = useState(false);

  const animateTo = (to: 0 | 1) => {
    Animated.timing(progress, {
      toValue: to,
      duration: to === 1 ? 300 : 220,
      easing: to === 1 ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: false, // height 애니메이션
    }).start();
  };

  // 열림/닫힘 상태 변경 시 애니메이션 실행(측정값이 있으면)
  useEffect(() => {
    if (measuredHeight > 0) animateTo(open ? 1 : 0);
  }, [open, measuredHeight]);

  // 히든 뷰에서 높이 측정
  const onHiddenLayout = (e) => {
    const h = e?.nativeEvent?.layout?.height ?? 0;
    if (h > 0) {
      setMeasuredHeight(h);
      setMeasuredOnce(true);
    } else {
      // 드물게 0으로 찍히는 케이스 방지: 다음 프레임에 재측정
      requestAnimationFrame(() => {
        const h2 = e?.nativeEvent?.layout?.height ?? 0;
        if (h2 > 0) {
          setMeasuredHeight(h2);
          setMeasuredOnce(true);
        }
      });
    }
  };

  const height = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, measuredHeight || 0],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 0.8, 1],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-4, 0],
  });

  // Fallback: 열림인데 아직 높이를 못잡았다면 먼저 내용을 보여주고(자동 높이), 이후 측정치가 잡히면 애니 전환
  const shouldFallbackAuto = open && measuredHeight === 0;

  return (
    <View>
      {/* 가시 컨테이너 */}
      {shouldFallbackAuto ? (
        <View style={[style]}>{children}</View>
      ) : (
        <Animated.View
          style={[{ height, overflow: 'hidden' }, style]}
          pointerEvents={open ? 'auto' : 'none'}
        >
          <Animated.View style={{ opacity, transform: [{ translateY }] }}>
            {children}
          </Animated.View>
        </Animated.View>
      )}

      {/* 히든 측정 뷰(최초 측정 완료되면 언마운트하여 성능 보호) */}
      {!measuredOnce && (
        <View
          style={[
            style,
            {
              position: 'absolute',
              opacity: 0,
              zIndex: -1,
              left: 0,
              right: 0,
            },
          ]}
          onLayout={onHiddenLayout}
          pointerEvents="none"
        >
          {children}
        </View>
      )}
    </View>
  );
};

const MenuContents = ({ route, navigation }) => {
  const { placeId, storeName } = route.params;
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openedSections, setOpenedSections] = useState<Record<string, boolean>>({});

  const { apiCall } = useApiService();
  console.log('MenuContents placeId:', placeId, 'storeName:', storeName);
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const data = await apiCall({
          url: 'get-feed-menu',
          method: 'POST',
          data: { placeId, storeName },
        });
        setMenuData(data);
      } catch (error) {
        setError(error.message || '메뉴 정보를 불러오지 못했습니다.');
        Alert.alert('Error', error.message || '메뉴 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuData();
  }, [placeId, storeName, apiCall]);

  const groupedMenus = useMemo(() => groupMenusByTitle(menuData), [menuData]);

  const toggleSection = (title: string) => {
    setOpenedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#FDA085" style={{ flex: 1, marginTop: 80 }} />;
  }

  if (error) {
    return (
      <View style={styles.centerBox}>
        <Text style={{ color: '#e74c3c', fontSize: 15 }}>Error: {error}</Text>
      </View>
    );
  }

  if (!groupedMenus || groupedMenus.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="restaurant-outline" size={72} color="#bbb" />
        <Text style={styles.emptyText}>등록된 메뉴가 없습니다</Text>
      </View>
    );
  }

  const renderMenuItem = (item, idx, groupTitle) => (
    <View style={styles.menuCard} key={`${groupTitle}_${item.menuName}_${idx}`}>
      <View style={styles.menuItemRow}>
        <Text style={styles.menuName} numberOfLines={1} ellipsizeMode="tail">
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
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.headerBox}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 18 }}
        >
          <Icon name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{storeName || '메뉴 정보'}</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={groupedMenus}
        keyExtractor={(item, idx) => `${item.title}_${idx}`}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>
            <TouchableOpacity
              style={[
                styles.sectionHeader,
                openedSections[item.title] && styles.sectionHeaderOpen,
              ]}
              onPress={() => toggleSection(item.title)}
              activeOpacity={0.82}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="fast-food-outline"
                  size={20}
                  color={openedSections[item.title] ? '#FDA085' : '#bbb'}
                  style={{ marginRight: 7 }}
                />
                <Text
                  style={[
                    styles.sectionTitle,
                    openedSections[item.title] && { color: '#FDA085' },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
              </View>
              <Icon
                name={openedSections[item.title] ? 'chevron-up' : 'chevron-down'}
                size={23}
                color={openedSections[item.title] ? '#FDA085' : '#bbb'}
              />
            </TouchableOpacity>

            <AnimatedAccordion open={!!openedSections[item.title]} style={styles.menuList}>
              {item.items.map((menuItem, idx) => renderMenuItem(menuItem, idx, item.title))}
            </AnimatedAccordion>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 10,
    paddingHorizontal: 8,
    marginBottom: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionContainer: {
    marginBottom: 14,
    borderRadius: 13,
    overflow: 'hidden',
    shadowColor: '#aaa',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9fa',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeaderOpen: { backgroundColor: '#FFF6F0', borderBottomColor: '#FDA085' },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 0.4,
    maxWidth: 210,
  },
  menuList: {
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingBottom: 6,
    paddingTop: 2,
  },
  menuCard: {
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  menuItemRow: { flexDirection: 'row', alignItems: 'center' },
  menuName: { fontSize: 15.5, color: '#212121', fontWeight: '500', flex: 1, marginRight: 8 },
  menuPrice: {
    fontSize: 15.5,
    color: '#FDA085',
    fontWeight: 'bold',
    marginLeft: 10,
    minWidth: 64,
    maxWidth: 110,
    textAlign: 'right',
  },
  menuNoPrice: {
    fontSize: 15.5,
    color: '#bbb',
    fontStyle: 'italic',
    marginLeft: 10,
    minWidth: 64,
    maxWidth: 110,
    textAlign: 'right',
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyText: { fontSize: 21, color: '#bbb', marginTop: 12, fontWeight: 'bold' },
});

export default MenuContents;
