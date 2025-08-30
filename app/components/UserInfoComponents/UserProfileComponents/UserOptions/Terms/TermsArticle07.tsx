import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsArticle07 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>제 7 조 (회원의 의무 및 금지행위)</Text>
      <Text style={styles.text}>
        회원은 서비스를 이용함에 있어 다음 각 호의 행위를 해서는 안 됩니다. 본 조의 의무를 위반할 경우 게시물의 삭제, 서비스 이용 제한, 이용계약 해지 등 제10조에 따른 조치가 이루어질 수 있으니 유의하시기 바랍니다.{"\n\n"}

        • <Text style={styles.bold}>법령 위반 행위:</Text> 현행 법령에 위배되는 불법적인 내용의 정보나 게시물을 게시하거나 전송하는 행위. 예: 음란물, 범죄 교사/방조, 명예훼손, 협박성 정보, 해킹, 악성코드 유포 등.{"\n\n"}

        • <Text style={styles.bold}>타인의 권리 침해:</Text> 타인의 저작권, 상표권, 초상권 등 지식재산권이나 사생활을 침해하는 행위. 비방, 모욕, 무단 사용 등 포함.{"\n\n"}

        • <Text style={styles.bold}>부적절한 콘텐츠 게시:</Text> 공서양속 및 사회 통념에 반하는 내용. 예: 노골적 성적 표현, 폭력성, 허위 사실, 사칭 등.{"\n\n"}

        • <Text style={styles.bold}>스팸 및 상업적 광고 행위:</Text> 사전 허가 없는 영리 목적 이용. 예: 홍보성 댓글/쪽지, 불법 의약품 판매, 반복 광고 게시물 등.{"\n\n"}

        • <Text style={styles.bold}>서비스 운영 방해:</Text> 계정 도용, 자동화 수단 사용, 과도한 트래픽 유발, 버그 악용, 리버스 엔지니어링, 허위 신고 등.{"\n\n"}

        • <Text style={styles.bold}>기타 불법∙부당행위:</Text> 위 각 호에 준하는 행위 또는 법령·약관·운영정책 위반.{"\n\n"}

        • <Text style={styles.bold}>회원 간 예의 준수:</Text> 협박, 괴롭힘, 차별, 혐오 표현, 지속적인 연락 시도 등은 금지되며 신고 시 제재될 수 있습니다.{"\n\n"}

        회원은 상기 금지행위를 인지한 경우 서비스 내 신고 기능을 통해 운영자에게 해당 사실을 알릴 수 있습니다. 운영자는 정당한 신고가 접수되면 신속히 사실 확인을 거쳐 필요한 조치를 취할 것입니다.{"\n\n"}

        또한 운영자는 정보통신망법 및 저작권법에 따라 권리 침해 신고가 있을 시 게시중단 또는 삭제 등의 필요한 조치를 취하며, 게시자의 이의신청이 있을 경우 관련 절차에 따라 처리합니다.{"\n\n"}

        단, 운영자가 모든 게시물을 사전 모니터링할 의무를 부담하는 것은 아니며, 회원은 적법하고 적절한 콘텐츠를 게시할 의무가 있습니다.
      </Text>
    </View>
  );
};

export default TermsArticle07;

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
