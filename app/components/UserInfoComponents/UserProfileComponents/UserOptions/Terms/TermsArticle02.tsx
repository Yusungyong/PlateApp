import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsArticle02 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>제 2 조 (정의)</Text>
      <Text style={styles.text}>
        이 약관에서 사용하는 용어의 정의는 다음과 같습니다.{"\n\n"}

        • <Text style={styles.bold}>서비스</Text>: 운영자가 제공하는 '접시' 모바일 애플리케이션 및 관련 제반 서비스를 말합니다. 여기에는 음식 추천, 지도 기반 맛집 추천, AI 추천, 룰렛 추천, 뉴스 정보 제공, 소셜 피드(게시물 업로드 및 친구 등록) 등 본 서비스가 제공하는 모든 기능을 포함합니다.{"\n\n"}

        • <Text style={styles.bold}>운영자</Text>: '접시' 서비스를 개발∙운영하는 자를 말하며, 본 서비스 제공자를 의미합니다.{"\n\n"}

        • <Text style={styles.bold}>회원</Text>: 본 서비스에 가입하여 이 약관에 동의하고 서비스를 이용하는 자를 말합니다.{"\n\n"}

        • <Text style={styles.bold}>게시물 또는 콘텐츠</Text>: 회원이 서비스 상에 업로드하거나 등록하는 문자, 사진, 영상, 댓글 등 모든 형태의 정보나 자료를 의미합니다.{"\n\n"}

        • <Text style={styles.bold}>친구</Text>: 서비스 내에서 상호 친구로 등록한 다른 회원을 말합니다. 회원은 친구 추가를 통해 서로의 게시물을 확인하거나 소통할 수 있습니다.{"\n\n"}

        • <Text style={styles.bold}>개인정보</Text>: 생존하는 개인에 관한 정보로서 이름, 이메일 등의 식별 정보 또는 위치정보 등 개인과 관련된 정보를 말하며, 개인정보 보호법 등 관련 법령에서 정의한 내용을 따릅니다.{"\n\n"}

        ※ 본 조에서 정하지 않은 용어의 정의는 관련 법령 및 일반적인 이용 약관의 관례에 따릅니다.
      </Text>
    </View>
  );
};

export default TermsArticle02;

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
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
});
