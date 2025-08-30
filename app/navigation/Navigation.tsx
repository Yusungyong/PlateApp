import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth/AuthProvider';
import LoginContents from '../components/LoginComponents/LoginContents';
import SignUpContents from '../components/LoginComponents/SignUpComponents/SignUpContents';
import HomeScreen from '../components/HomeContents/HomeScreen';
import PlayContents from '../components/videoComponents/PlayContents';
import UploadController from '../components/uploadComponents/UploadController';
import UserInfoContents from '../components/UserInfoComponents/UserInfoContents';
import MenuContents from '../components/menuComponents/MenuContents';
import MapContents from '../components/mapContents/MapContents';
import FriendFinder from '../components/UserInfoComponents/UserProfileComponents/FriendComponents/FriendFinder';
import MenuOptions from '../components/UserInfoComponents/UserProfileComponents/UserOptions/MenuOptions';
import WithdrawalInfo from '../components/UserInfoComponents/UserProfileComponents/UserOptions/WithdrawalInfo';
import TermsOfService from '../components/UserInfoComponents/UserProfileComponents/UserOptions/Terms/TermsOfService';
import CreateNickName from '../components/UserInfoComponents/UserProfileComponents/UserOptions/CreateNickName';
import CreatePost from '../components/FeedComponents/CreateFeed/CreatePost';
import ForgotPasswordRequest from '../components/LoginComponents/Verify/ForgotPasswordRequest';
import ResetPassword from '../components/LoginComponents/Verify/ResetPassword';
import EmailRegister from '../components/UserInfoComponents/UserProfileComponents/UserOptions/EmailRegister';
import PhoneRegister from '../components/UserInfoComponents/UserProfileComponents/UserOptions/PhoneRegister';
import HomeFeed from '../components/FeedComponents/HomeFeed';
import ReadUserProfile from '../components/UserInfoComponents/ReadUserProfile/ReadUserProfile';
import FeedFilterSettings from '../components/UserInfoComponents/UserProfileComponents/Filter/FeedFilterSettings';
import VideoFilterSettings from '../components/UserInfoComponents/UserProfileComponents/Filter/VideoFilterSettings';
import ContentsComponent from '../components/FeedComponents/ContentsComponent';
import VisitHistoryScreen from '../components/UserInfoComponents/UserProfileComponents/FriendComponents/VisitHistory/VisitHistoryScreen';
import ChangePasswordScreen from '../components/LoginComponents/SignUpComponents/ChangePasswordScreen';
import BlockedUserList from '../components/UserInfoComponents/UserProfileComponents/UserOptions/BlockedUserList';
import PrivacyPolicyScreen from '../components/UserInfoComponents/UserProfileComponents/UserOptions/PrivacyPolicyScreen';
import LocationGuard from '../components/HomeContents/LocationGuard';
import StoreScreen from '../components/StoreComponent/StoreScreen';
import FeedImageViewer from '../components/FeedImage/FeedImageViewer';
import FindIdScreen from '../components/LoginComponents/FindIdScreen';
import StoreDetailScreen from '../components/StoreComponent/storeDetails/StoreDetailScreen';
import NewsDetailScreen from '../components/HomeContents/HomeNewsSection/NewsEditor/NewsDetailScreen';
import { CustomNewsEditor } from '../components/HomeContents/HomeNewsSection';



const Stack = createNativeStackNavigator();

const Navigation: React.FC = () => {
  const { isLoggedIn, role, login } = useAuth();

  if (role === 'ROLE_GUEST') {
    return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Login"
        >
          {props => <LoginContents {...props} onLoginSuccess={login} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUpContents} />
        <Stack.Screen name="ForgotPasswordRequest" component={ForgotPasswordRequest} />
        <Stack.Screen name="이용약관" component={TermsOfService} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="FindIdScreen" component={FindIdScreen} />
        <Stack.Screen name="홈" component={LocationGuard} />
        <Stack.Screen name="컨텐츠" component={ContentsComponent} />
        <Stack.Screen name="HomeFeed" component={HomeFeed} />
        <Stack.Screen name="재생" component={PlayContents} />
        <Stack.Screen name="업로드" component={UploadController} />
        <Stack.Screen name="FeedFilterSettings" component={FeedFilterSettings} />
        <Stack.Screen name="VideoFilterSettings" component={VideoFilterSettings} />
        <Stack.Screen name="Menu" component={MenuContents} />
        <Stack.Screen name="CustomNewsEditor" component={CustomNewsEditor} />
        <Stack.Screen name="ReadUserProfile" component={ReadUserProfile} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} />
        <Stack.Screen name="FeedImageViewer" component={FeedImageViewer} />
        <Stack.Screen name="StoreScreen" component={StoreScreen} />
        <Stack.Screen name="프로필" component={UserInfoContents} />
        <Stack.Screen name="StoreDetailScreen" component={StoreDetailScreen} />
        <Stack.Screen
          name="지도"
          component={MapContents}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="홈" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="홈" component={LocationGuard} />
      <Stack.Screen name="컨텐츠" component={ContentsComponent} />
      <Stack.Screen name="HomeFeed" component={HomeFeed} />
      <Stack.Screen name="재생" component={PlayContents} />
      <Stack.Screen name="업로드" component={UploadController} />
      <Stack.Screen name="FeedFilterSettings" component={FeedFilterSettings} />
      <Stack.Screen name="VideoFilterSettings" component={VideoFilterSettings} />
      <Stack.Screen name="Menu" component={MenuContents} />
      <Stack.Screen name="CustomNewsEditor" component={CustomNewsEditor} />
      <Stack.Screen name="ReadUserProfile" component={ReadUserProfile} />
      <Stack.Screen name="CreatePost" component={CreatePost} />
      <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} />
      <Stack.Screen name="StoreScreen" component={StoreScreen} />
      <Stack.Screen name="FeedImageViewer" component={FeedImageViewer} />
      <Stack.Screen name="이용약관" component={TermsOfService} />
      <Stack.Screen name="VisitHistoryScreen" component={VisitHistoryScreen} />
      <Stack.Screen name="BlockedUserList" component={BlockedUserList} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Stack.Screen name="FriendFinder" component={FriendFinder} />
      <Stack.Screen name="CreateNickName" component={CreateNickName} />
      <Stack.Screen name="EmailRegister" component={EmailRegister} />
      <Stack.Screen name="PhoneRegister" component={PhoneRegister} />
      <Stack.Screen name="MenuOptions" component={MenuOptions} />
      <Stack.Screen name="WithdrawalInfo" component={WithdrawalInfo} />
      <Stack.Screen name="StoreDetailScreen" component={StoreDetailScreen} />
      <Stack.Screen
        name="Login"
      >
        {props => <LoginContents {...props} onLoginSuccess={login} />}
      </Stack.Screen>
      <Stack.Screen name="프로필" component={UserInfoContents} />
      <Stack.Screen
        name="지도"
        component={MapContents}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
