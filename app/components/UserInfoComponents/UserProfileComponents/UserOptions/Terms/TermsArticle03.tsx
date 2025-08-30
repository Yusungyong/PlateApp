import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsArticle03 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>제 3 조 (약관의 게시와 개정)</Text>
      <Text style={styles.text}>
        운영자는 본 약관의 내용을 회원이 쉽게 확인할 수 있도록 서비스 초기 화면 또는 설정 메뉴 등에 게시합니다.{"\n\n"}

        운영자는 약관의 규제에 관한 법률, 정보통신망법 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.{"\n\n"}

        약관을 개정할 경우 적용일자 및 개정내용, 개정사유를 명시하여 최소 적용일 30일 이전(회원에게 불리한 변경의 경우) 또는 7일 이전(회원에게 불리하지 않은 경우)에 서비스 내 공지사항 등을 통해 공지하며, 중요한 변경사항에 대해서는 이메일 등 개별 통지합니다.{"\n\n"}

        운영자가 전항에 따라 개정 약관을 공지 또는 통지하면서 기간 내에 회원의 거부 의사가 접수되지 않으면 개정에 동의한 것으로 볼 수 있음을 명시하였음에도, 회원이 명시적으로 거부의사를 표시하지 아니한 경우 개정 약관에 동의한 것으로 간주합니다. 회원이 개정 약관에 동의하지 않는 경우 해당 회원은 이용계약을 해지할 수 있습니다.
      </Text>
    </View>
  );
};

export default TermsArticle03;

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
