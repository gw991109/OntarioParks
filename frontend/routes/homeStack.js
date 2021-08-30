import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

//screens
import MainPage from '../screens/MainPage';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Map from '../screens/Map';
import SettingPreference from '../screens/SettingPreference';
import AttractionDetail from '../screens/AttractionDetail';
import UserMainPage from '../screens/UserMainPage';

const screens = {
    MainPage:{
        screen: MainPage
    },
    Login:{
        screen: Login
    },
    SignUp:{
        screen: SignUp
    },
    Map:{
        screen: Map
    },
    SettingPreference:{
        screen: SettingPreference
    },
    AttractionDetail:{
        screen: AttractionDetail
    },
    UserMainPage:{
        screen: UserMainPage
    }
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);