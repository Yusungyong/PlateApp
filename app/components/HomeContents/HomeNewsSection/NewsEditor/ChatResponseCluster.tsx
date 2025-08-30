// components/Home/ChatResponseCluster.tsx
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  Text,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import ThumbnailSuggestionList from './ThumbnailSuggestionList';

const { width, height } = Dimensions.get('window');

type Suggestion = {
  id: string;
  imageUrl: string;
  title?: string;
  storeName?: string;
  distance?: string;
};

interface Props {
  visible: boolean;
  onClose: () => void;
  suggestions: Suggestion[];
}

const ChatResponseCluster: React.FC<Props> = ({ visible, onClose, suggestions }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <Animatable.View animation="slideInUp" duration={500} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🎯 AI 추천 리스트</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollBox}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {suggestions.length === 0 ? (
              <Text style={styles.emptyMessage}>추천 결과가 없습니다 🥲</Text>
            ) : (
              <ThumbnailSuggestionList data={suggestions} />
            )}
          </ScrollView>
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    width,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -6 },
    maxHeight: height * 0.75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  closeButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  scrollBox: {
    flexGrow: 1,
  },
  emptyMessage: {
    marginTop: 32,
    textAlign: 'center',
    color: '#999',
    fontSize: 15,
  },
});

export default ChatResponseCluster;
