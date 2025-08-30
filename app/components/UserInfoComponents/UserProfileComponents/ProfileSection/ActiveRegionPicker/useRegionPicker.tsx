import { useState, useCallback } from "react";
import { Modal, Platform, KeyboardAvoidingView, View, StyleSheet } from "react-native";
import ActiveRegionSheet from "./ActiveRegionSheet";

export const useRegionPicker = () => {
  const [visible, setVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");

  const openPicker = useCallback(() => {
    setVisible(true);
  }, []);

  const RegionPickerModal = useCallback(() => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.overlay}>
          <ActiveRegionSheet
            onClose={() => setVisible(false)}
            onRegionSelect={(region) => {
              setSelectedRegion(region);
              setVisible(false);
            }}            
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  ), [visible]);

  return {
    openPicker,
    RegionPickerModal,
    selectedRegion,
  };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
});
