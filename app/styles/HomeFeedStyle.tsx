import { StyleSheet } from 'react-native';

export const HomeFeedstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feedItem: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // 왼쪽 영역이 가능한 공간을 차지하도록 설정
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  feedTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    flexWrap: 'wrap',
    flex: 1, // 고정 width 대신 flex를 사용하여 유동적으로 조절
    marginRight: 10, // 오른쪽 영역과 간격 확보
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  defaultProfileIcon: {
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  content: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  feedImage: {
    flex: 1,
    maxWidth: '100%',
    maxHeight: 300,
    resizeMode: 'contain',
    borderRadius: 8,
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  retryText: {
    marginTop: 10,
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'transparent',
    width: 44,
    height: 44,
    borderRadius: 28,
    borderWidth: 0.5,
    borderColor: '#FF7F50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  footerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  iconText: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: 200,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'flex-start',
  },
  modalText: {
    fontSize: 16,
    marginLeft: 10,
  },
  storeNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 4,
    textAlign: 'right',
  },
  locationText: {
    flexDirection: 'row',
    alignItems: 'center',
    color: 'gray',
    fontSize: 14,
    flexWrap: 'wrap',
    maxWidth: '70%',
  },
  readMore: {
    fontSize: 12,
    color: '#007BFF',
    textAlign: 'right',
    marginTop: -20,
    paddingRight: 10,
  },
});
