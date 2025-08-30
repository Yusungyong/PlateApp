import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>개인정보 처리방침</Text>

        <Text style={styles.content}>
          접시(이하 "서비스")는 이용자의 개인정보 보호를 매우 중요시하며, 개인정보보호법 등 관련 법령을 준수합니다.{'\n\n'}
          본 방침은 서비스가 수집하는 개인정보의 항목, 이용 목적, 보유 기간, 보호 조치 등에 대해 설명합니다.{'\n\n'}
          1. 수집 항목: 이름, 이메일, 전화번호 등 회원가입 시 입력한 정보 및 서비스 이용 중 생성되는 정보{'\n'}
          2. 이용 목적: 회원 식별, 서비스 제공, 맞춤형 콘텐츠 제공, 고객 응대 등{'\n'}
          3. 보유 기간: 회원 탈퇴 시까지 보유하며, 관련 법령에 따라 일정 기간 보관될 수 있음{'\n'}
          4. 제3자 제공: 원칙적으로 외부에 제공하지 않으며, 사전에 동의받은 경우에 한함{'\n'}
          5. 이용자 권리: 개인정보 열람, 수정, 삭제 요청 가능, 서비스 내 고객센터를 통해 처리 요청 가능{'\n\n'}
          서비스는 개인정보 보호를 위해 최선의 노력을 다하며, 관련 변경 사항이 발생할 경우 본 방침을 통해 안내합니다.
        </Text>
      </ScrollView>

      {/* ✅ 하단 고정 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.agreeButton}
          onPress={() => navigation.navigate('SignUp', { agreedType: 'privacy' })}
        >
          <Text style={styles.agreeButtonText}>동의하고 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    paddingTop: 100,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
  agreeButton: {
    backgroundColor: '#2f80ed',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
  },
  agreeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
