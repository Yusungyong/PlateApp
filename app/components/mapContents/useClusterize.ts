const useClusterize = (data: any[], threshold = 0.001) => {
  const clusters: any[][] = [];

  const validData = Array.isArray(data)
    ? data.filter(item => item && item.latitude && item.longitude)
    : [];

  validData.forEach(item => {
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);
    let added = false;

    for (let cluster of clusters) {
      const centerLat = Number(cluster[0].latitude);
      const centerLng = Number(cluster[0].longitude);
      if (Math.abs(lat - centerLat) < threshold && Math.abs(lng - centerLng) < threshold) {
        cluster.push(item);
        added = true;
        break;
      }
    }

    if (!added) {
      clusters.push([item]);
    }
  });

  return clusters;
};

export default useClusterize;
