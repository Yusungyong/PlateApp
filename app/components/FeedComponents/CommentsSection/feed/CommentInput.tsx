import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  Keyboard,
} from 'react-native';
import LoginRequiredModal from '../../../../auth/LoginRequiredModal';
import { useAuth } from '../../../../auth/AuthProvider';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  chip: '#F5F5F5',
  inputBg: '#F0F0F0',
  border: '#E5E7EB',
  text: '#111827',
  sub: '#6B7280',
  link: '#007AFF',
  primary: '#FF7F50',
  placeholder: '#9CA3AF',
  button: '#007AFF',
  buttonDisabled: '#CCCCCC',
  buttonText: '#FFFFFF',
};

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16 };
const RADIUS = { pill: 20 };

type ReplyTo = { nickname: string; commentId?: number } | null;

type Props = {
  replyTo?: ReplyTo;
  onCancelReply?: () => void;
  onSubmit: (text: string) => void;
  keyboardVerticalOffset?: number;
};

const CommentInput: React.FC<Props> = ({
  replyTo,
  onCancelReply,
  onSubmit,
  keyboardVerticalOffset,
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const { isLoggedIn, role } = useAuth();
  const isGuest = role === 'ROLE_GUEST';

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, [text, replyTo]);

  useEffect(() => {
    if (replyTo && inputRef.current) inputRef.current.focus();
  }, [replyTo]);

  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0;

  const openLoginModal = useCallback(() => {
    setLoginModalVisible(true);
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isLoggedIn || isGuest) return openLoginModal();
    if (!canSubmit) return;
    onSubmit(trimmed);
    setText('');
  }, [isLoggedIn, isGuest, canSubmit, trimmed, onSubmit, openLoginModal]);

  const handleFocus = useCallback(() => {
    if (!isLoggedIn || isGuest) openLoginModal();
  }, [isLoggedIn, isGuest, openLoginModal]);

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
      <View style={styles.container} accessibilityRole="form">
        {replyTo && (
          <View style={styles.replyingTo}>
            <Text style={styles.replyTag}>@{replyTo.nickname}</Text>
            <Text style={styles.replyText}>님에게 답글 작성 중</Text>
            <TouchableOpacity
              onPress={onCancelReply}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="대댓글 작성 취소"
            >
              <Text style={styles.cancel}>취소</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="댓글을 입력하세요"
            placeholderTextColor={COLORS.placeholder}
            multiline
            numberOfLines={1}
            selectionColor={COLORS.primary}
            // Android multiline에서는 onSubmitEditing이 보장되지 않음 — 등록 버튼 사용 권장
            returnKeyType={Platform.OS === 'ios' ? 'send' : 'default'}
            blurOnSubmit={false}
            onSubmitEditing={handleSubmit}
            onFocus={handleFocus}
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

        <LoginRequiredModal visible={loginModalVisible} onClose={() => setLoginModalVisible(false)} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },

  replyingTo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.chip,
  },
  replyTag: { fontWeight: '700', color: COLORS.link, marginRight: 4 },
  replyText: { fontSize: 14, color: COLORS.sub, flex: 1 },
  cancel: { marginLeft: SPACING.sm, color: COLORS.sub, fontSize: 14 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.bg,
    gap: SPACING.sm,
  },
  // placeholder 세로 중앙 정렬(안드 대응)
  input: {
    flex: 1,
    maxHeight: 120,
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 10, android: 0 }),
    textAlignVertical: Platform.select({ ios: 'center', android: 'center' }) as any,
    includeFontPadding: false,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.text,
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: COLORS.buttonDisabled },
  submitText: { color: COLORS.buttonText, fontWeight: '700', fontSize: 14 },
});

export default CommentInput;
