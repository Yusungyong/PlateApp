import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';

const VideoDescription = ({ username, title, description }) => {
  const [expanded, setExpanded] = useState(false);
  const [fullLineCount, setFullLineCount] = useState(0);

  const handleTextLayout = (e) => {
    setFullLineCount(e.nativeEvent.lines.length);
  };

  const showMoreButton = fullLineCount > 2;

  return (
    <View style={styles.container}>
      {/* invisible 텍스트로 전체 줄 수 측정 */}
      <Text
        style={[styles.content, styles.hiddenText]}
        onTextLayout={handleTextLayout}
      >
        {username} {title} {description}
      </Text>

      {/* 실제 표시 텍스트 */}
      <Text style={styles.content} numberOfLines={expanded ? undefined : 2}>
        <Text style={styles.username}>{username} </Text>
        {description}
      </Text>

      {showMoreButton && !expanded && (
        <TouchableOpacity onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(true);
        }} style={styles.readMoreTouchable}>
          <Text style={styles.readMore}>더 보기</Text>
        </TouchableOpacity>
      )}

      {showMoreButton && expanded && (
        <TouchableOpacity onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(false);
        }} style={styles.readLessTouchable}>
          <Text style={styles.readLess}>줄이기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible',
    marginLeft: 15,
    padding: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  hiddenText: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  username: {
    fontSize: 16,
    fontWeight: '900',
    color: '#333',
  },
  readMoreTouchable: {
    alignSelf: 'flex-end',
    paddingRight: 10,
  },
  readMore: {
    fontSize: 12,
    color: '#007BFF',
  },
  readLessTouchable: {
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  readLess: {
    fontSize: 12,
    color: '#007BFF',
  },
});

export default VideoDescription;
