import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TermsArticle01 from './TermsArticle01';
import TermsArticle02 from './TermsArticle02';
import TermsArticle03 from './TermsArticle03';
import TermsArticle04 from './TermsArticle04';
import TermsArticle05 from './TermsArticle05';
import TermsArticle06 from './TermsArticle06';
import TermsArticle07 from './TermsArticle07';
import TermsArticle08 from './TermsArticle08';
import TermsArticle09 from './TermsArticle09';
import TermsArticle10 from './TermsArticle10';
import TermsArticle11 from './TermsArticle11';
import TermsArticle12And13 from './TermsArticle12And13';

const TermsOfService = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>접시 앱서비스 이용약관</Text>

      <TermsArticle01 />
      <TermsArticle02 />
      <TermsArticle03 />
      <TermsArticle04 />
      <TermsArticle05 />
      <TermsArticle06 />
      <TermsArticle07 />
      <TermsArticle08 />
      <TermsArticle09 />
      <TermsArticle10 />
      <TermsArticle11 />
      <TermsArticle12And13 />

      <TouchableOpacity
        style={styles.agreeButton}
        onPress={() => navigation.navigate('SignUp', { agreedType: 'terms' })}
      >
        <Text style={styles.agreeButtonText}>동의하고 돌아가기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TermsOfService;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 100,
    paddingBottom: 60,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  agreeButton: {
    marginTop: 40,
    marginBottom: 60,
    backgroundColor: '#2f80ed',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  agreeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
