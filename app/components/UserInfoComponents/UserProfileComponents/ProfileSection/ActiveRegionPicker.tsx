import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Dimensions } from "react-native";
import RegActiveRegion from "../UserOptions/RegActiveRegion";
import useGetActiveRegion from "../UserOptions/GetActiveRegion";

const { height } = Dimensions.get("window");

const ActiveRegionPicker = ({ onClose, onRegionSelect }) => {
  const { regionList, loading } = useGetActiveRegion();
  const [activeParentId, setActiveParentId] = useState(null); // 현재 선택된 parentId 관리
  const [selectedRegionPath, setSelectedRegionPath] = useState(""); // 선택된 지역 경로
  const [confirmingRegion, setConfirmingRegion] = useState(false); // 등록 여부 확인 상태
  const { axiosApiRegActiveRegion } = RegActiveRegion({ region: selectedRegionPath }); // region 값 전달

  // depth가 1인 데이터만 필터링
  const topLevelRegions = regionList.filter((region) => region.depth === 1);

  // 현재 선택된 parentId에 해당하는 하위 데이터 필터링
  const childRegions = regionList.filter((region) => region.parentId === activeParentId);

  // 현재 보여줄 데이터 (depth가 1 또는 선택된 하위 데이터)
  const displayedRegions = activeParentId === null ? topLevelRegions : childRegions;

  const handleRegionPress = (regionId) => {
    const selectedRegion = regionList.find((region) => region.id === regionId);

    if (selectedRegion.depth === 2) {
      // depth 2인 경우 경로 생성 및 등록 확인 단계로 이동
      const path = generateRegionPath(regionId);
      setSelectedRegionPath(path);
      setConfirmingRegion(true); // 등록 여부 확인 상태로 전환
    } else {
      setActiveParentId(regionId); // depth 1인 경우 하위 데이터 표시
    }
  };

  const handleBackPress = () => {
    setActiveParentId(null); // 상위로 돌아가기
  };

  const handleConfirm = async () => {
    try {
      // API 호출
      await axiosApiRegActiveRegion();

      // 부모 컴포넌트에 선택된 지역 전달
      if (onRegionSelect) {
        onRegionSelect(selectedRegionPath);
      }

      onClose(); // 모달 닫기
    } catch (error) {
      console.error("활동지역 등록 실패:", error.message);
    }
  };

  const handleCancel = () => {
    // 등록 확인 취소 및 초기화
    setSelectedRegionPath("");
    setConfirmingRegion(false);
    setActiveParentId(null);
  };

  const generateRegionPath = (regionId) => {
    const regionPath = [];
    let currentRegion = regionList.find((region) => region.id === regionId);

    while (currentRegion) {
      regionPath.unshift(currentRegion.regionName);
      currentRegion = regionList.find((region) => region.id === currentRegion.parentId);
    }

    return regionPath.join(" ");
  };

  return (
    <View style={styles.modalContent}>
      {confirmingRegion ? (
        // 등록 여부 확인 화면
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmText}>
            활동지역으로 설정된 지역: {selectedRegionPath}
          </Text>
          <Text style={styles.confirmQuestion}>활동지역으로 등록할까요?</Text>
          <View style={styles.confirmButtons}>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // 지역 선택 화면
        <>
          <View style={styles.header}>
            <Text style={styles.modalText}>
              {activeParentId === null ? "활동 지역 선택" : "세부 지역 선택"}
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : displayedRegions.length > 0 ? (
            <FlatList
              data={displayedRegions}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.regionItem}
                  onPress={() => handleRegionPress(item.id)}
                >
                  <Text style={styles.regionName}>{item.regionName}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.text}>표시할 데이터가 없습니다.</Text>
          )}

          {activeParentId !== null && (
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Text style={styles.backButtonText}>뒤로가기</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: "92%",
    height: height * 0.55,
    backgroundColor: "#FEFCF8", // 부드러운 크림색
    borderRadius: 24,
    padding: 24,
    alignSelf: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    alignItems: "center",
    marginBottom: 18,
  },
  modalText: {
    fontSize: 22,
    color: "#333",
    fontWeight: "bold",
    letterSpacing: -0.3,
  },
  listContent: {
    paddingBottom: 12,
  },
  regionItem: {
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1ECE6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  regionName: {
    fontSize: 17,
    color: "#444",
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  text: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginVertical: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 16,
  },
  confirmText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  confirmQuestion: {
    fontSize: 16,
    color: "#666",
    marginBottom: 28,
    textAlign: "center",
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#FF7043", // 감성 주황
    borderRadius: 12,
    marginHorizontal: 6,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#BDBDBD",
    borderRadius: 12,
    marginHorizontal: 6,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    paddingVertical: 12,
    backgroundColor: "#FFAB91", // 주황색 연톤
    borderRadius: 12,
    marginTop: 14,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  closeButton: {
    paddingVertical: 12,
    backgroundColor: "#ECECEC",
    borderRadius: 12,
    marginTop: 14,
  },
  closeButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});


export default ActiveRegionPicker;