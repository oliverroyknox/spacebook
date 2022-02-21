import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import Theme from './theme';
import { getUser } from './api/requests';

import AuthNavigator from './navigation/AuthNavigator';
import ContentNavigator from './navigation/ContentNavigator';

/**
 * @typedef {import("@react-navigation/native").ParamListBase} ParamListBase
 * @typedef {import("@react-navigation/native").RouteProp} RouteProp
 * @typedef {import("@react-navigation/bottom-tabs").BottomTabNavigationOptions} NavigationOptions
 */

const renderIonicon = ({ name, color, size, direction }) => <Ionicons name={name} color={color} size={size} direction={direction} />;

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
	 * @param {number} userId ID of the authenticated user.
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

	return (
		<PaperProvider theme={Theme} settings={{ icon: renderIonicon }}>
			<NavigationContainer>
				{isAuthenticated ? (
					<ContentNavigator userId={currentUserId} setUserId={setCurrentUserId} onUnauthenticate={onUnauthenticate} />
				) : (
					<AuthNavigator onAuthenticate={onAuthenticate} />
				)}
			</NavigationContainer>
		</PaperProvider>
	);
}
