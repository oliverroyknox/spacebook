import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import FriendsPage from './pages/FriendsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

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

/**
 * Sets the screen options for the tab navigator component.
 * @param {Object} options Navigator options.
 * @param {RouteProp<ParamListBase, string>} options.route Current navigator route.
 * @returns Modified screen options.
 */
const setTabNavigatorScreenOptions = ({ route }) => ({
  tabBarIcon: (options) => renderTabBarIcon(route, options),
  tabBarLabelPosition: 'below-icon',
  tabBarStyle: { marginBottom: '4px' },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Callback to set `isAuthenticated` state.
   * @param {string} token Session token granted on successful authentication.
   */
  const onAuthenticate = (token) => {
    setIsAuthenticated(true);
    console.log(token); // TODO: Add to persistent storage.
  };

  return (
    <NavigationContainer>
      { isAuthenticated ? (
        <Tab.Navigator screenOptions={setTabNavigatorScreenOptions}>
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="Search" component={SearchPage} />
          <Stack.Screen name="Friends" component={FriendsPage} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginPage} initialParams={{ onAuthenticate }} />
          <Stack.Screen name="Signup" component={SignupPage} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
