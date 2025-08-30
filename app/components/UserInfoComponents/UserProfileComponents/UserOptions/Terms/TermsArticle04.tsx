import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsArticle04 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>제 4 조 (이용계약의 체결 및 회원가입)</Text>
      <Text style={styles.text}>
        서비스 이용을 위해 회원가입이 필수입니다. 회원이 되고자 하는 자는 운영자가 정한 절차에 따라 본 약관과 개인정보처리방침 등에 동의하고 회원 정보를 제공하여 가입 신청을 해야 합니다. 운영자는 이러한 신청에 대해 승낙함으로써 이용계약이 성립됩니다.{"\n\n"}

        <Text style={styles.bold}>연령 제한:</Text> 본 서비스는 특별한 연령 제한 없이 이용할 수 있으나, 만 14세 미만 아동이 회원으로 가입하고자 할 경우 정보통신망법 제31조 및 개인정보 보호법 등 관련 법령에 따라 반드시 법정대리인의 동의가 필요합니다. 만 14세 미만 이용자가 회원가입을 신청한 경우, 운영자는 법정대리인의 동의 절차를 거치며, 동의가 없을 시 가입을 제한하거나 취소할 수 있습니다. 법정대리인은 아동의 개인정보 열람∙정정 및 동의 철회를 요청할 권리가 있습니다.{"\n\n"}

        회원은 가입 시 정확하고 사실적인 정보를 제공해야 하며, 특히 타인의 명의를 도용하거나 허위 정보를 입력해서는 안 됩니다. 회원 정보(예: 이메일, 닉네임 등)에 변경이 발생한 경우 지체 없이 운영자에게 알리거나 서비스 내 수정 기능을 통해 정보를 최신으로 유지해야 합니다.{"\n\n"}

        하나의 회원은 원칙적으로 하나의 계정만 생성하여 이용할 수 있으며, 부득이한 사정으로 다수의 계정 사용이 필요한 경우 운영자의 사전 승인을 받아야 합니다. 회원 계정 및 비밀번호의 관리 책임은 회원에게 있으며, 이를 제3자에게 공유하거나 양도해서는 안 됩니다.{"\n\n"}

        회원의 부주의로 인한 계정 접근 및 사용상의 손해나 제3자에 의한 부정 사용 등에 대한 책임은 회원 본인이 부담하며, 운영자는 고의 또는 중대한 과실이 없는 한 이에 대한 책임을 지지 않습니다.
      </Text>
    </View>
  );
};

export default TermsArticle04;

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
