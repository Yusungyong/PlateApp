import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import TasteTagList from '../../UserInfoComponents/UserPostComponents/PlateCard/TasteTagList';

interface Props {
  nickName: string;
  content: string;
  tags?: string | null; // optional로 선언해두는 것이 안전
}

const FeedContentText: React.FC<Props> = ({ nickName, content, tags }) => {
  const [expanded, setExpanded] = useState(false);
  const [fullLineCount, setFullLineCount] = useState(0);

  const showMoreButton = fullLineCount > 2;

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
  }

  const handleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(true);
  };

  const handleCollapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(false);
  };

  // tags가 null/undefined일 경우 빈 배열로 처리
  const tagList = typeof tags === 'string'
    ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];

  return (
    <View style={styles.contentContainer}>
      {/* Invisible full text for line count */}
      <Text
        style={[styles.content, styles.hiddenText]}
        onTextLayout={(e) => setFullLineCount(e.nativeEvent.lines.length)}
      >
        {nickName} {content}
      </Text>

      {/* Visible content */}
      <Text style={styles.content} numberOfLines={expanded ? undefined : 2}>
        <Text style={styles.nickNameText}>{nickName}</Text> {content}
      </Text>

      {/* 태그 리스트 공통 컴포넌트로 출력 */}
      {tagList.length > 0 && <TasteTagList tags={tagList} />}

      {/* 더 보기 / 줄이기 */}
      {showMoreButton && !expanded && (
        <TouchableOpacity onPress={handleExpand} style={styles.moreLessContainer}>
          <Text style={styles.moreLessText}>더 보기</Text>
        </TouchableOpacity>
      )}
      {showMoreButton && expanded && (
        <TouchableOpacity onPress={handleCollapse} style={styles.moreLessContainer}>
          <Text style={styles.moreLessText}>줄이기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 15,
    marginTop: 8,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  hiddenText: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  moreLessContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  moreLessText: {
    fontSize: 12,
    color: '#007BFF',
  },
  nickNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
});

export default FeedContentText;
