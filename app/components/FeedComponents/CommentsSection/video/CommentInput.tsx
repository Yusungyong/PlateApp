// ✅ Flat-style CommentInput.tsx (refined UX, tokens, accessibility)
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import LoginRequiredModal from '../../../../auth/LoginRequiredModal';
import { useAuth } from '../../../../auth/AuthProvider';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** Design tokens */
const COLORS = {
  bg: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  sub: '#6B7280',
  primary: '#FF7F50',
  link: '#007AFF',
  inputBg: '#FFFFFF',
  placeholder: '#9CA3AF',
  disabled: '#D1D5DB',
  danger: '#EF4444',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
};

const RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
};

type Props = {
  replyTo?: { nickname: string } | null;
  onCancelReply?: () => void;
  onSubmit: (text: string) => void;
  inputRef?: React.RefObject<TextInput>;
  /** 키보드 보정이 필요한 레이아웃이면 외부에서 offset 조정 가능 */
  keyboardVerticalOffset?: number;
};

const CommentInput: React.FC<Props> = ({
  replyTo,
  onCancelReply,
  onSubmit,
  inputRef,
  keyboardVerticalOffset,
}) => {
  const [text, setText] = useState('');
  const { isLoggedIn, role } = useAuth();
  const isGuest = role === 'ROLE_GUEST';
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useEffect(() => {
    // 입력 영역 높이 변화 시 부드럽게
    LayoutAnimation.easeInEaseOut();
  }, [text, replyTo]);

  useEffect(() => {
    if (replyTo && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [replyTo, inputRef]);

  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(trimmed);
    setText('');
  };

  const handleInputFocus = () => {
    if (!isLoggedIn || isGuest) {
      setLoginModalVisible(true);
      inputRef?.current?.blur();
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={
        typeof keyboardVerticalOffset === 'number'
          ? keyboardVerticalOffset
          : Platform.OS === 'ios'
          ? 80
          : 0
      }
    >
      <View style={styles.wrapper} accessibilityRole="form">
        {replyTo && (
          <View style={styles.replyToRow}>
            <Text
              style={styles.replyToText}
              accessibilityRole="text"
              accessibilityLabel={`${replyTo.nickname}님에게 대댓글 작성중`}
            >
              {replyTo.nickname}님에게 대댓글 작성중
            </Text>
            <TouchableOpacity
              onPress={onCancelReply}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="대댓글 작성 취소"
            >
              <Text style={styles.cancelButton}>취소</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="댓글을 입력하세요"
            placeholderTextColor={COLORS.placeholder}
            value={text}
            onChangeText={setText}
            multiline
            onFocus={handleInputFocus}
            selectionColor={COLORS.primary}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSubmit}
            accessibilityLabel="댓글 입력"
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityRole="button"
            accessibilityLabel="댓글 등록"
            accessibilityState={{ disabled: !canSubmit }}
          >
            <Text style={styles.submitText}>등록</Text>
          </TouchableOpacity>
        </View>

        <LoginRequiredModal
          visible={loginModalVisible}
          onClose={() => setLoginModalVisible(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md + SPACING.xs, // 홈 인디케이터 근처 여유
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  replyToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  replyToText: {
    fontSize: 13,
    color: COLORS.sub,
  },
  cancelButton: {
    fontSize: 13,
    color: COLORS.link,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // 여러 줄일 때 버튼과 하단 정렬
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    backgroundColor: COLORS.inputBg,
    textAlignVertical: 'center',
  },
  submitButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CommentInput;
