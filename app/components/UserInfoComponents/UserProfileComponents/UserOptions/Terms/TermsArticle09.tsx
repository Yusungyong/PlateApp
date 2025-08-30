import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsArticle09 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>제 9 조 (신고 및 책임)</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>회원 콘텐츠 신고:</Text> 회원은 서비스 내에 불법정보 또는 약관 위반 게시물이 발견될 경우, 앱 내 마련된 신고 기능을 통해 운영자에게 해당 게시물을 신고할 수 있습니다. 운영자는 신고 내용을 검토하여 적절한 조치를 취하며, 필요 시 신고 내용을 관계 기관에 전달하거나 법적 조치를 협조할 수 있습니다.{"\n\n"}

        개인정보 침해나 명예훼손 등 권리 침해가 발생했다고 주장하는 자는 정보통신망법 제44조의2에 따라 해당 정보의 삭제나 임시 조치를 운영자에게 요청할 수 있으며, 운영자는 판단이 어려운 경우 해당 게시물의 접근을 일시적으로 제한(임시조치)할 수 있습니다. 게시자가 이의신청을 하지 않으면 일정 기간 후 해당 게시물이 삭제될 수 있습니다.{"\n\n"}

        <Text style={styles.bold}>권리 침해 신고:</Text> 타인의 게시물이 자신의 저작권을 침해하거나 명예훼손 등 불법행위에 해당한다고 판단되는 경우, 권리자는 운영자에게 권리침해 신고를 할 수 있습니다. 운영자는 저작권법 및 관련 법령에 따라 적절한 증빙 자료를 요구하고, 필요한 경우 해당 게시물을 삭제하거나 검색에서 제외하는 등의 조치를 취할 수 있습니다.{"\n\n"}

        게시자는 저작권법 제103조에 따라 이의신청(재게시 요청)을 할 수 있으며, 운영자는 분쟁 해결을 위한 절차를 내부에 마련하여 성실히 임합니다.{"\n\n"}

        <Text style={styles.bold}>회원의 법령 및 약관 위반 책임:</Text> 회원이 본 약관 또는 관련 법령을 위반하여 운영자 또는 제3자에게 손해를 입힌 경우, 해당 회원은 그에 대한 책임을 부담합니다. 예를 들어, 회원의 게시물로 인해 운영자가 법적 분쟁이나 손해배상 부담을 지게 된 경우, 운영자는 해당 회원에게 구상권을 행사할 수 있습니다.{"\n\n"}

        이 경우, 운영자는 법령에 따라 손해의 범위 내에서 책임을 물으며, 회원은 고의 또는 과실이 없음을 입증하지 않는 한 그 손해를 배상해야 합니다.
      </Text>
    </View>
  );
};

export default TermsArticle09;

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
