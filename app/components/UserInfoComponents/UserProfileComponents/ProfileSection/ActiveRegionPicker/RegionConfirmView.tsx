import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface Props {
  regionPath: string;
  onConfirm: () => void;
}

const RegionConfirmView: React.FC<Props> = ({ regionPath, onConfirm }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>선택한 지역</Text>
      <View style={styles.regionBox}>
        <Text style={styles.regionText}>{regionPath}</Text>
      </View>
      <Text style={styles.question}>이 지역으로 활동지역을 등록할까요?</Text>
      <TouchableOpacity style={styles.confirmButton} onPress={() => {
        onConfirm();
      }}>
        <Text style={styles.confirmText}>등록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: "#888",
    marginBottom: 6,
  },
  regionBox: {
    backgroundColor: "#FFF3E0",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 24,
  },
  regionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF7043",
  },
  question: {
    fontSize: 16,
    color: "#444",
    marginBottom: 40,
  },
  confirmButton: {
    backgroundColor: "#FF7043",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginBottom:50,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegionConfirmView;
