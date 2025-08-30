import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsArticle12And13 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>제 12 조 (준거법 및 관할)</Text>
      <Text style={styles.text}>
        이 약관 및 '접시' 서비스와 관련한 일체의 분쟁에 대해서는 대한민국 법령이 적용됩니다. 이 약관에서 명시되지 않은 사항은 관련 법령 또는 상관례에 따릅니다.{"\n\n"}

        서비스 이용과 관련하여 운영자와 회원 간에 분쟁이 발생한 경우, 운영자와 회원은 성실히 협의하여 분쟁 해결을 위해 노력합니다. 협의로 문제가 해결되지 않을 경우 민사소송법 등 관계 법령에 따른 관할 법원을 따릅니다.{"\n\n"}

        운영자의 주소지를 관할하는 법원을 1심의 합의 관할 법원으로 정할 수 있으며, 이에 대해 개별 협의가 없는 경우 민사소송법에 따른 법원이 전속 관할로 적용됩니다.
      </Text>

      <Text style={[styles.title, { marginTop: 32 }]}>제 13 조 (기타 조항)</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>양도 금지:</Text> 회원은 서비스 이용권한, 계정, 게시물 등을 타인에게 양도, 대여, 담보 제공할 수 없으며, 이를 위반하여 발생한 불이익에 대해 운영자는 책임지지 않습니다.{"\n\n"}

        <Text style={styles.bold}>전체 합의:</Text> 본 약관은 회원과 운영자 간의 서비스 이용에 대한 전체 합의를 의미하며, 회원이 개별적으로 동의한 정책 및 안내사항과 함께 적용됩니다. 개별 약관과 본 약관이 충돌하는 경우, 해당 서비스에 대해 별도로 명시된 약관이 우선 적용됩니다.{"\n\n"}

        <Text style={styles.bold}>약관의 해석:</Text> 본 약관의 일부 조항이 무효로 판단되더라도, 나머지 조항의 효력은 유지됩니다. 무효 조항은 법령에 맞춰 본 약관의 취지에 가깝게 해석됩니다.{"\n\n"}

        <Text style={styles.bold}>문의:</Text> 회원은 서비스 이용과 관련된 문의를 고객센터 또는 운영자가 제공하는 연락처를 통해 제기할 수 있으며, 운영자는 이에 성실히 응대합니다.{"\n\n"}

        <Text style={styles.bold}>부칙:</Text>{"\n"}
        (1) 이 약관은 2025년 6월 9일부터 시행됩니다.{"\n"}
        (2) 본 약관 시행 전 가입한 회원은 변경된 약관에 동의한 것으로 간주됩니다.{"\n"}
        (3) 기존 약관은 본 약관으로 대체되며, 개정 전 행위에도 적용됩니다.{"\n"}
        (4) 운영자가 개인에서 법인으로 전환되거나 운영 주체가 변경될 경우, 사전 고지 후 필요한 경우 약관이 개정됩니다.
      </Text>
    </View>
  );
};

export default TermsArticle12And13;

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
