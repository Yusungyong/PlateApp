import { StyleSheet } from 'react-native';

export const likePodsStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  cardContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  video: {
    width: '40%',
    aspectRatio: 11 / 16,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  image: {
    width: '40%',
    aspectRatio: 11 / 16,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  storeAndLikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    width: 150,
    color: '#333',
  },
  likeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartContainer: {
    padding: 4,
    marginRight: 4,
  },
  likeCountContainer: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 190,
    marginBottom: 8,
  },
  distance: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  username: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dates: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f00',
  },
  noItemsText: {
    flex: 1,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  selectedItemContainer: {
    borderWidth: 2,
    borderColor: '#FF7F50', // 선택된 항목 테두리 색상
  },
});


export const podsListContentsStyles = StyleSheet.create({
  gridCardContainer: {
    flex: 1, // 동일한 크기 유지
    margin: 5, // 카드 간격
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1, // 정사각형 이미지
    resizeMode: 'cover',
    borderRadius: 8,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  flatListContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export const podsListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  tabText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  selectedTabText: {
    color: '#FF7F50',
    fontWeight: 'bold',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#FF7F50',
    borderRadius: 2,
  },
});


export const friendListStyles = StyleSheet.create({
    container: {
        padding: 10,
      },
      connectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#FF7F50',
        marginRight: 10,
      },
      friendName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex:1,
      },
      menuButton: {
        paddingHorizontal: 10,
      },
      addVisitIcon: {
        fontSize: 24,
        color: '#FF7F50',
        fontWeight: 'bold',
      },
      detailsContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
      },
      detailItem: {
        marginBottom: 15,
      },
      storeRow: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      storeImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#FF7F50',
        marginRight: 10,
      },
      storeInfo: {
        flex: 1,
      },
      storeName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#777',
      },
      visitDate: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
      },
      address: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
      },
      placeholder: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
      },
});