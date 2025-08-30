import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsArticle11 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>제 11 조 (책임의 한계와 면책 조항)</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>운영자의 책임 범위:</Text> 운영자는 회원이 서비스를 이용함에 있어 운영자의 고의 또는 중대한 과실로 인하여 손해를 입은 경우, 관련 법령에 따라 그 손해를 배상할 책임을 집니다. 예를 들어, 운영자의 과실로 인해 회원정보가 유출되어 손해가 발생한 경우, 운영자는 법적 책임을 부담합니다.{"\n\n"}

        <Text style={styles.bold}>면책 사항:</Text>{"\n"}
        다음과 같은 경우 운영자는 책임을 지지 않습니다.{"\n"}
        • 천재지변, 폭동, 화재, 홍수 등 불가항력으로 인한 서비스 중단 및 손해{"\n"}
        • 회원의 고의 또는 과실로 인한 손해 (예: 비밀번호 관리 소홀로 인한 계정 도용 등){"\n"}
        • 운영자의 귀책 없이 발생한 일시적 서비스 장애나 오류{"\n"}
        • 무료로 제공되는 서비스 이용 중 발생한 간접손해, 특별손해 등{"\n\n"}

        <Text style={styles.bold}>정보 신뢰도 및 품질 관련 면책:</Text> 운영자는 서비스에서 제공되는 음식점 추천, AI 추천, 뉴스 기사 등의 정보의 정확성, 효용, 만족도 등에 대해 법적 책임을 지지 않습니다. 해당 정보는 참고용이며, 회원의 선택에 따라 활용되어야 합니다. 단, 명백한 오류나 오정보는 확인되는 즉시 수정 또는 삭제 조치합니다.{"\n\n"}

        <Text style={styles.bold}>회원 간 분쟁:</Text> 회원 간, 또는 회원과 비회원 간의 서비스 이용을 통한 직접적 분쟁에 대하여 운영자는 개입하지 않으며, 이에 따른 책임을 지지 않습니다. 예: 오프라인 만남으로 인한 분쟁, 피드 게시물 신뢰 후 발생한 문제 등. 다만, 서비스 내에서 발생한 신고 사항은 적절히 조정하거나 조치를 취할 수 있습니다.{"\n\n"}

        <Text style={styles.bold}>연결 사이트 및 제3자 콘텐츠:</Text> 서비스 내에서 외부 웹사이트로 연결되는 링크가 제공될 수 있으나, 외부 콘텐츠나 사이트에 대해서는 운영자가 관리하지 않으므로 그 정확성이나 신뢰성에 책임을 지지 않습니다. 또한 제3자 광고나 콘텐츠 역시 그 진실성에 대한 책임은 제공자에게 있습니다.{"\n\n"}

        <Text style={styles.bold}>기타 면책:</Text> 운영자는 법령 또는 이 약관에 의해 면책이 인정되는 범위 내에서 책임을 면합니다. 또한, 공공기관의 요청 등 법적 절차에 따라 회원 정보를 제공한 경우 그로 인한 책임을 지지 않습니다.{"\n\n"}

        <Text style={styles.bold}>손해배상의 범위:</Text> 운영자가 책임을 지는 경우에도, 간접 손해, 특별 손해, 징벌적 손해 등에 대해서는 법령상 특별한 규정이 없는 한 책임을 지지 않으며, 통상적으로 발생한 직접적인 손해만을 한도로 배상합니다.{"\n\n"}

        <Text style={styles.bold}>손해배상의 청구:</Text> 회원이 운영자에게 손해배상을 청구하고자 하는 경우, 증빙 자료를 갖추어 서면으로 청구해야 하며, 운영자는 접수일로부터 30일 이내에 답변 또는 조치를 취합니다. 사정상 30일 내 처리가 어려운 경우, 사유 및 일정을 사전 고지합니다.
      </Text>
    </View>
  );
};

export default TermsArticle11;

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
