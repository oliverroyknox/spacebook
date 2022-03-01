import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LogoHeader from '../components/LogoHeader';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';

const Stack = createNativeStackNavigator();

export default function AuthNavigator({ onAuthenticate }) {
  const { colors } = useTheme();

  const screenOptions = {
    headerTitle: LogoHeader,
    headerLeft: () => null,
    headerStyle: { backgroundColor: colors.header },
    headerTintColor: colors.headerText,
  };

  const renderLoginPage = ({ navigation }) => (
    <LoginPage navigation={navigation} onAuthenticate={onAuthenticate} />
  );

  const renderSignupPage = ({ navigation }) => (
    <SignupPage navigation={navigation} onAuthenticate={onAuthenticate} />
  );

  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={screenOptions}>
        {renderLoginPage}
      </Stack.Screen>
      <Stack.Screen name="Signup" options={screenOptions}>
        {renderSignupPage}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

AuthNavigator.propTypes = {
  onAuthenticate: PropTypes.func.isRequired,
};
