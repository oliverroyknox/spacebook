import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import FriendsPage from './pages/FriendsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Callback to set `isAuthenticated` state.
   */
  const onAuthenticate = () => {
    setIsAuthenticated(true);
  };

  setTimeout(onAuthenticate, 3000); // TODO: Placeholder for authentication flow.

  return (
    <NavigationContainer>
      { isAuthenticated ? (
        <Tab.Navigator>
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="Search" component={SearchPage} />
          <Stack.Screen name="Friends" component={FriendsPage} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Signup" component={SignupPage} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
