import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import RegionListView from "./RegionListView";
import RegionConfirmView from "./RegionConfirmView";

const { height } = Dimensions.get("window");

const ActiveRegionSheet = ({ onClose, onRegionSelect }) => {
  const [step, setStep] = useState<"list" | "confirm">("list");
  const [selectedRegionPath, setSelectedRegionPath] = useState("");

  const sheetHeight = step === "confirm" ? height * 0.45 : height * 0.7;

  const handleRegionFinalSelect = (regionPath: string) => {
    setSelectedRegionPath(regionPath);
    setStep("confirm");
  };

  const handleConfirm = () => {
    onRegionSelect?.(selectedRegionPath);
    onClose();
  };

  return (
    <View style={[styles.container, { height: sheetHeight }]}>
      <View style={styles.header}>
        {step === "confirm" ? (
          <TouchableOpacity onPress={() => setStep("list")}>
            <Icon name="chevron-left" size={24} color="#444" />
          </TouchableOpacity>
        ) : <View style={{ width: 24 }} />}
        <Text style={styles.title}>
          {step === "list" ? "활동 지역 선택" : "이 지역으로 등록할까요?"}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="x" size={24} color="#444" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {step === "list" ? (
          <RegionListView onSelectRegion={handleRegionFinalSelect} />
        ) : (
          <RegionConfirmView regionPath={selectedRegionPath} onConfirm={handleConfirm} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
});

export default ActiveRegionSheet;
