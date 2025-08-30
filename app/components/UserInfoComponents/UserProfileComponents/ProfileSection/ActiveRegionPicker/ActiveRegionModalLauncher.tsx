import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import ActiveRegionSheet from "./ActiveRegionSheet";

const ActiveRegionModalLauncher: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleRegionSelect = async (region: string) => {
    try {
      const { axiosApiRegActiveRegion } = RegActiveRegion({ region });
      await axiosApiRegActiveRegion();
      setSelectedRegion(region);
    } catch (error) {
      console.error("❌ 활동지역 등록 실패", error);
    } finally {
      setModalVisible(false); // ✅ 이게 맞는 이름
    }
  };
  
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.launchButton} onPress={openModal}>
        <Text style={styles.launchText}>활동지역 선택하기</Text>
      </TouchableOpacity>

      {selectedRegion !== "" && (
        <Text style={styles.selectedText}>선택된 지역: {selectedRegion}</Text>
      )}

      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <ActiveRegionSheet
            onClose={closeModal}
            onRegionSelect={handleRegionSelect}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 120,
    paddingHorizontal: 24,
    flex: 1,
    backgroundColor: "#fff",
  },
  launchButton: {
    backgroundColor: "#FF7043",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignSelf: "center",
  },
  launchText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedText: {
    marginTop: 24,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
});

export default ActiveRegionModalLauncher;
