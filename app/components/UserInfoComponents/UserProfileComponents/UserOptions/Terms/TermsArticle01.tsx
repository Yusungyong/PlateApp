import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsArticle01 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>제 1 조 (목적)</Text>
      <Text style={styles.text}>
        이 약관은 1인 개발자 유성용(이하 "운영자")이 제공하는 음식 추천 소셜 플랫폼 '접시' 서비스(이하 "서비스")의 이용과 관련하여 운영자와 회원 간의 권리∙의무 및 책임사항, 기타 필요한 사항을 정함을 목적으로 합니다.{"\n\n"}
        본 약관은 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보 보호법, 저작권법 등 대한민국 관련 법령에 부합하도록 작성되었습니다.
      </Text>
    </View>
  );
};

export default TermsArticle01;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
});
