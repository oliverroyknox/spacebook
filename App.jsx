import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import Theme from './theme';
import { getUser } from './api/requests';
import {
  registerBackgroundPostTask,
  unregisterBackgroundPostTask,
} from './helpers/background-fetch';

import AuthNavigator from './navigation/AuthNavigator';
import ContentNavigator from './navigation/ContentNavigator';

const renderIonicon = ({ name, color, size, direction }) => (
  <Ionicons name={name} color={color} size={size} direction={direction} />
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(-1);

  const loadSavedCredentials = async () => {
    try {
      const userId = Number(await AsyncStorage.getItem('user_id'));
      const sessionToken = await AsyncStorage.getItem('session_token');

      if (userId && sessionToken) {
        // check if saved credentials are valid, if so then update the authentication state.
        const { ok } = await getUser({ userId, sessionToken });
        if (!ok) return;

        setTimeout(() => {
          setCurrentUserId(Number(userId));
          setIsAuthenticated(true);
        }, 300);
      }
    } catch (err) {
      setCurrentUserId(-1);
      setIsAuthenticated(false);
    }
  };

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

  const onUnauthenticate = async () => {
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('session_token');
    setIsAuthenticated(false);
    setCurrentUserId(-1);
  };

  useEffect(() => {
    loadSavedCredentials();

    return () => {
      setCurrentUserId(-1);
      setIsAuthenticated(false);
    };
  }, []);

  useEffect(async () => {
    // cleanup and registed a new background task when the user is authenticated.
    if (isAuthenticated) {
      try {
        await unregisterBackgroundPostTask();
      } catch (err) {
        console.log({ err });
      }

      try {
        await registerBackgroundPostTask();
      } catch (err) {
        console.log({ err });
      }
    }
  }, [isAuthenticated]);

  return (
    <PaperProvider theme={Theme} settings={{ icon: renderIonicon }}>
      <NavigationContainer>
        {isAuthenticated ? (
          <ContentNavigator
            userId={currentUserId}
            setUserId={setCurrentUserId}
            onUnauthenticate={onUnauthenticate}
          />
        ) : (
          <AuthNavigator onAuthenticate={onAuthenticate} />
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}
