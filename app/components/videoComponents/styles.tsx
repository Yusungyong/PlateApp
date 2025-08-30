import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    width: screenWidth,
    height: screenHeight,
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  touchableArea: {
    position: 'absolute',
    top: 0,
    bottom: 245,
    left: 0,
    right: 60,
    zIndex: 1,
    backgroundColor: 'transparent', //'transparent'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    paddingBottom: 20,
  },
  infoContainer: {
    flex: 1,
    marginRight: 20,
    padding: 10,  // 내부 여백 추가
    backgroundColor: 'rgba(0, 0, 0, 0.2)',  // 반투명 배경
    borderRadius: 10,  // 모서리 곡률 추가
    elevation: 5,  // Android용 그림자
    zIndex: 2
},
  username: {
    fontSize: 16,  // 기존보다 크게 설정
    color: 'white',
    fontWeight: 'bold',  // 폰트의 가중치를 더 크게 설정
    marginBottom: 5,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  buttonGroup: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  buttonWrapper: {
    marginBottom: 30,  // 기존 간격에서 약간 증가시킴
  },
  button: {
    alignItems: 'center',
    zIndex: 3,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 10,  // 기존 간격에서 약간 증가시킴
  },
  icon: {
    fontSize: 33, // 아이콘 크기를 조금 더 키움 (기존 32)
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 32,  // 크기를 기존보다 더 크게 설정
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 2,  // 테두리 두께 설정
    borderColor: 'white',  // 테두리 색상 설정
  },
  videoAddressContainer: {
    flexDirection: 'row',  // 아이콘과 텍스트를 가로로 배치
    alignItems: 'center',
  },
  videoAddress: {
    fontSize: 12,
    color: 'white',
  },
  locationIcon: {
    fontSize: 16,
    color: 'white',
  },
  addFriend: {
    color : 'white',
    fontSize : 38,
    paddingVertical: 0,  // 위아래 패딩을 0으로 설정
    lineHeight: 38,      // lineHeight 추가
  },
  likeContainer: {
    flexDirection: 'column', // 분리된 형태로 수직 배치
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeCountTouchable: {
    padding: 4,
  },
  likeCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
