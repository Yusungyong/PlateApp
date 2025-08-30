import React from 'react';
import { Circle } from 'react-native-maps';
import { zoomToRadius } from './Hooks/zoomToRadius'; // 경로 수정

type Props = {
  center: { latitude: number; longitude: number };
  delta: number;
  fillColor: string;
};

const SearchRadius: React.FC<Props> = ({ center, delta, fillColor }) => (
  <Circle
    center={center}
    radius={zoomToRadius(delta)}
    strokeWidth={1}
    strokeColor="rgba(0,122,255,0.7)"
    fillColor={fillColor}
  />
);

export default SearchRadius;
