// utils/zoomToRadius.ts
export const zoomToRadius = (latitudeDelta: number): number => {
    if (latitudeDelta < 0.01) return 500;    // 아주 좁은 범위
    if (latitudeDelta < 0.05) return 1000;
    if (latitudeDelta < 0.1) return 2000;
    if (latitudeDelta < 0.3) return 3000;
    if (latitudeDelta < 0.6) return 4000;
    if (latitudeDelta < 1.0) return 5000;
    return 10000; // 아주 넓은 범위
  };
  