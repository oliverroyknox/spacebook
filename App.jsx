import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getUser } from './helpers/requests';

import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import FriendsPage from './pages/FriendsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LogoHeader from './components/LogoHeader';

/**
 * @typedef {import("@react-navigation/native").ParamListBase} ParamListBase
 * @typedef {import("@react-navigation/native").RouteProp} RouteProp
 * @typedef {import("@react-navigation/bottom-tabs").BottomTabNavigationOptions} NavigationOptions
 */

/**
 * Render an `Ionicon` icon for a tab.
 * @param {RouteProp<ParamListBase, string>} route Route for tab.
 * @param {NavigationOptions} options Inherited icon options.
 * @returns `Ionicon` element.
 */
function renderTabBarIcon(route, options) {
  const { name } = route;
  const { size, color } = options;

  let icon = '';
  switch (name) {
    case 'Profile':
      icon = 'person-circle';
      break;
    case 'Search':
      icon = 'search';
      break;
    case 'Friends':
      icon = 'people';
      break;
    default:
      break;
  }

  return <Ionicons name={icon} size={size} color={color} />;
}

const renderIonicon = ({
  name, color, size, direction,
}) => (
  <Ionicons name={name} color={color} size={size} direction={direction} />
);

/**
 * Sets the screen options for the tab navigator component.
 * @param {Object} options Navigator options.
 * @param {RouteProp<ParamListBase, string>} options.route Current navigator route.
 * @returns Modified screen options.
 */
const setTabNavigatorScreenOptions = ({ route }) => ({
  tabBarIcon: (options) => renderTabBarIcon(route, options),
  tabBarLabelPosition: 'below-icon',
  tabBarStyle: { marginBottom: 4 },
  headerShown: false,
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#218FFF',
    error: '#ff4646',
    page: '#fff',
    divider: '#dcdcdc',
    header: '#3d5f7d',
    headerText: '#fff',
  },
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(-1);

  /**
   * Loads saved user login credentials to skip sign in process.
   */
  const loadSavedCredentials = async () => {
    try {
      const userId = Number(await AsyncStorage.getItem('user_id'));
      const sessionToken = await AsyncStorage.getItem('session_token');

      if (userId && sessionToken) {
        const { ok } = await getUser({ userId, sessionToken });
        if (!ok) return;

        setCurrentUserId(Number(userId));
        setIsAuthenticated(true);
      }
    } catch (err) {
      setCurrentUserId(-1);
      setIsAuthenticated(false);
    }
  };

  useEffect(loadSavedCredentials, []);

  /**
   * Callback to set `isAuthenticated` state and update persistent storage.
   * @param {Object} userData Authenticated user's data.
   * @param {string} userId ID of the authenticated user.
   * @param {string} sessionToken Token granted on successful authentication.
   */
  const onAuthenticate = async ({ userId, sessionToken }) => {
    try {
      await AsyncStorage.setItem('user_id', String(userId));
      await AsyncStorage.setItem('session_token', sessionToken);
      setCurrentUserId(userId);
      setIsAuthenticated(true);
    } catch (e) {
      setCurrentUserId(-1);
      setIsAuthenticated(false);
    }
  };

  /**
   * Callback to set `isAuthenticated` state. Performs the inverse of `onAuthenticate`.
   */
  const onUnauthenticate = async () => {
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('session_token');
    setIsAuthenticated(false);
    setCurrentUserId(-1);
  };

  /**
   * Render `ProfilePage` with custom props.
   * @param {Object} data Navigator props.
   * @param {Object} data.route Navigator route.
   * @returns `ProfilePage` component.
   */
  const renderProfilePage = ({ route }) => (
    <ProfilePage route={route} onUnauthenticate={onUnauthenticate} />
  );

  /**
   * Render `LoginPage` with custom props.
   * @param {Object} data Navigator props.
   * @param {Object} data.navigation Navigator navigation.
   * @returns `LoginPage` component.
   */
  const renderLoginPage = ({ navigation }) => (
    <LoginPage
      navigation={navigation}
      onAuthenticate={onAuthenticate}
    />
  );

  /**
   * Render `SignupPage` with custom props.
   * @param {Object} data Navigator props.
   * @param {Object} data.navigation Navigator navigation.
   * @returns `SignupPage` component.
   */
  const renderSignupPage = ({ navigation }) => (
    <SignupPage navigation={navigation} onAuthenticate={onAuthenticate} />
  );

  return (
    <PaperProvider theme={Theme} settings={{ icon: renderIonicon }}>
      <NavigationContainer>
        {isAuthenticated ? (
          <Tab.Navigator screenOptions={setTabNavigatorScreenOptions}>
            <Stack.Screen
              name="Profile"
              initialParams={{ userId: currentUserId }}
            >
              {renderProfilePage}
            </Stack.Screen>
            <Stack.Screen name="Search" component={SearchPage} />
            <Stack.Screen name="Friends" component={FriendsPage} />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              options={{
                headerTitle: LogoHeader,
                headerLeft: () => null,
                headerStyle: { backgroundColor: Theme.colors.header },
                headerTintColor: Theme.colors.headerText,
              }}
            >
              {renderLoginPage}
            </Stack.Screen>
            <Stack.Screen
              name="Signup"
              options={{
                headerTitle: LogoHeader,
                headerLeft: () => null,
                headerStyle: { backgroundColor: Theme.colors.header },
                headerTintColor: Theme.colors.headerText,
              }}
            >
              {renderSignupPage}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}
