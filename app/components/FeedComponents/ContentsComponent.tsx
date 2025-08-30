// HomeScreen.tsx 또는 HomeScreen.js
import React from 'react';
import HomeFeed from './HomeFeed';
import CommonLayout from '../../common/CommonLayout';

const ContentsComponent: React.FC = () => {
  return (
    <CommonLayout>
      <HomeFeed />
    </CommonLayout>
  );
};

export default ContentsComponent;
