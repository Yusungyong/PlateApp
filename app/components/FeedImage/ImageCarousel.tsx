import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  FlatList,
  Dimensions,
  StyleSheet,
  View,
  Image as RNImage,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
// ⚠️ 예전에 BVLinearGradient 충돌 있었으면, 정리 전까진 import/사용하지 마세요
// import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function ImageCarousel({
  images,
  initialIndex = 0,
  onIndexChange,
  maxScale = 3,
}: {
  images: string[];
  initialIndex?: number;
  onIndexChange?: (idx: number) => void;
  maxScale?: number;
}) {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // 자식이 "확대 중/아님"을 알려주면 캐러셀 스크롤 on/off
  const handleZoomState = useCallback((isZooming: boolean) => {
    setScrollEnabled(!isZooming);
  }, []);

  return (
    <View style={styles.container}>
      {/* 필요하면 그라데이션 추가 (패키지 충돌 정리 후)
      <LinearGradient ... />
      */}

      <FlatList
        data={images}
        horizontal
        pagingEnabled
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, idx) => ({
          length: SCREEN_W,
          offset: SCREEN_W * idx,
          index: idx,
        })}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <ZoomableCell
              uri={item}
              maxScale={maxScale}
              onZoomStateChange={handleZoomState}
            />
          </View>
        )}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          onIndexChange?.(idx);
        }}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

/** 각 셀: 라이브러리로 확대/이동 처리 */
function ZoomableCell({
  uri,
  maxScale = 3,
  onZoomStateChange,
}: {
  uri: string;
  maxScale?: number;
  onZoomStateChange?: (b: boolean) => void;
}) {
  // 이미지 원본 비율 유지(Contain)로 렌더될 "기본 크기" 계산
  const [base, setBase] = useState({ w: SCREEN_W, h: SCREEN_H });
  useEffect(() => {
    RNImage.getSize(
      uri,
      (w, h) => {
        const fit = Math.min(SCREEN_W / w, SCREEN_H / h);
        setBase({ w: Math.round(w * fit), h: Math.round(h * fit) });
      },
      () => setBase({ w: SCREEN_W, h: SCREEN_H })
    );
  }, [uri]);

  // scale 상태에 따라 부모 FlatList 스크롤 on/off + panToMove 동기화
  const zoomingRef = useRef(false);
  const [panToMove, setPanToMove] = useState(false); // 확대 중에만 드래그 이동 허용

  const setZooming = (z: boolean) => {
    if (zoomingRef.current !== z) {
      zoomingRef.current = z;
      setPanToMove(z);              // 확대 중에만 이미지가 가로/세로 드래그를 먹음
      onZoomStateChange?.(z);       // 부모에 알려 FlatList 스크롤 제어
    }
  };

  return (
    // 화면 크기만큼 클리핑 → 배경 노출 방지
    <View style={{ width: SCREEN_W, height: SCREEN_H, overflow: 'hidden' }}>
      <ImageZoom
        cropWidth={SCREEN_W}
        cropHeight={SCREEN_H}
        imageWidth={base.w}
        imageHeight={base.h}
        minScale={1}
        maxScale={maxScale}
        // 확대중에만 드래그 이동 허용 (축소 상태에서는 부모 캐러셀로 가도록)
        panToMove={panToMove}
        pinchToZoom
        enableDoubleClickZoom
        doubleClickInterval={250}
        enableCenterFocus
        useNativeDriver
        // 스케일 변화를 계속 알려줌
        onMove={(pos) => {
          const s = pos.scale ?? 1;
          setZooming(s > 1.0001);
        }}
        // 손 뗄 때 한 번 더 보정해서 부모 스크롤을 복원/유지
        onResponderRelease={(pos) => {
          const s = pos.scale ?? 1;
          setZooming(s > 1.0001);
        }}
        // 가장자리 마찰(러버밴드) 강도 (픽셀). 기본값 150, 취향껏 조절
        maxOverflow={120}
        // need set disable or conflicts? 기본값으로도 충분
      >
        <FastImage
          source={{ uri }}
          style={{ width: base.w, height: base.h }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </ImageZoom>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  imageWrapper: {
    width: SCREEN_W,
    height: SCREEN_H,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
