import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

export default AuthStack = createStackNavigator({ Login: LoginScreen, SignUp: SignUpScreen }, {headerMode: 'none'});