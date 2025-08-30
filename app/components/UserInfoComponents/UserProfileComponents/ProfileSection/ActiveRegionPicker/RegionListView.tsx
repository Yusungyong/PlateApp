import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import useGetActiveRegion from "../../UserOptions/GetActiveRegion";

interface Region {
  id: number;
  parentId: number | null;
  regionName: string;
  depth: number;
}

interface Props {
  onSelectRegion: (regionPath: string) => void;
}

const RegionListView: React.FC<Props> = ({ onSelectRegion }) => {
  const { regionList, loading } = useGetActiveRegion();
  const [activeParentId, setActiveParentId] = useState<number | null>(null);

  const topLevelRegions = regionList.filter((r) => r.depth === 1);
  const childRegions = regionList.filter((r) => r.parentId === activeParentId);

  const displayedRegions = activeParentId === null ? topLevelRegions : childRegions;

  const generateRegionPath = (regionId: number): string => {
    const regionPath = [];
    let current = regionList.find((r) => r.id === regionId);
    while (current) {
      regionPath.unshift(current.regionName);
      current = regionList.find((r) => r.id === current.parentId);
    }
    return regionPath.join(" ");
  };

  const handleItemPress = (region: Region) => {
    if (region.depth === 1) {
      setActiveParentId(region.id);
    } else if (region.depth === 2) {
      const fullPath = generateRegionPath(region.id);
      onSelectRegion(fullPath);
    }
  };

  const handleBack = () => setActiveParentId(null);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7043" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {activeParentId !== null && (
        <TouchableOpacity onPress={handleBack} style={styles.backRow}>
          <Text style={styles.backText}>← 상위 지역으로 돌아가기</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={displayedRegions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleItemPress(item)}
            style={styles.itemRow}
          >
            <Text style={styles.itemText}>{item.regionName}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  itemRow: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1ECE6",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  backRow: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FFF3E0",
    marginBottom: 8,
    borderRadius: 8,
  },
  backText: {
    fontSize: 14,
    color: "#FF7043",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegionListView;
