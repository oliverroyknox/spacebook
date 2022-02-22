import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { List, Snackbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFriendRequests, getFriends, acceptFriendRequest, declineFriendRequest } from '../api/requests';
import capitalise from '../helpers/strings';
import PageStyles from '../styles/page';
import FriendRequest from '../components/FriendRequest';
import User from '../components/User';

export default function FriendsPage({ navigation, setUserId }) {
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	const [friendRequests, setFriendRequests] = useState([]);
	const [friends, setFriends] = useState([]);
	const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	function showSnackbar(message) {
		setSnackbarMessage(capitalise(message));
		return setIsSnackbarVisible(true);
	}

	const onDismissSnackbar = () => setIsSnackbarVisible(false);

	async function loadFriendRequests() {
		const sessionToken = await AsyncStorage.getItem('session_token');

		const response = await getFriendRequests({ sessionToken });

		if (response.ok) {
			setFriendRequests(response.body || []);
		}
	}

	async function loadFriends() {
		const userId = Number(await AsyncStorage.getItem('user_id'));
		const sessionToken = await AsyncStorage.getItem('session_token');

		const response = await getFriends({ userId, sessionToken });

		if (response.ok) {
			setFriends(response.body || []);
		}
	}

	const onAcceptFriendRequest = async ({ userId }) => {
		try {
			const sessionToken = await AsyncStorage.getItem('session_token');
			const response = await acceptFriendRequest({ userId, sessionToken });

			if (response.ok) {
				// sync friends and friend requests state with server.
				await loadFriendRequests();
				await loadFriends();
				return showSnackbar('accepted friend request.');
			}

			return showSnackbar(response.message);
		} catch (err) {
			return showSnackbar('failed to accept friend request, try again later.');
		}
	};

	const onDeclineFriendRequest = async ({ userId }) => {
		try {
			const sessionToken = await AsyncStorage.getItem('session_token');
			const response = await declineFriendRequest({ userId, sessionToken });

			if (response.ok) {
				// sync friends and friend requests state with server.
				await loadFriendRequests();
				await loadFriends();
				return showSnackbar('declined friend request.');
			}

			return showSnackbar(response.message);
		} catch (err) {
			return showSnackbar('failed to decline friend request, try again later.');
		}
	};

	const onGoToUser = ({ userId }) => {
		setUserId(userId);
		navigation.navigate('Profile');
	};

	function renderFriendRequests() {
		return friendRequests.map(({ userId, firstName, lastName }) => (
			<FriendRequest key={userId} userId={userId} firstName={firstName} lastName={lastName} onAccept={onAcceptFriendRequest} onDecline={onDeclineFriendRequest} />
		));
	}

	function renderFriends() {
		return friends.map(({ userId, userGivenname, userFamilyname }) => (
			<User key={userId} userId={userId} firstName={userGivenname} lastName={userFamilyname} onGoToUser={onGoToUser} />
		));
	}

	useEffect(async () => {
		await loadFriendRequests();
		await loadFriends();
	}, []);

	return (
		<View style={PageStyles(theme, insets).page}>
			<ScrollView>
				{friendRequests.length > 0 && (
					<List.Section>
						<List.Subheader>Friend Requests</List.Subheader>
						{renderFriendRequests()}
					</List.Section>
				)}
				{friends.length > 0 ? (
					<List.Section>
						<List.Subheader>Friends</List.Subheader>
						{renderFriends()}
					</List.Section>
				) : (
					<List.Section>
						<List.Subheader>Friends</List.Subheader>
						<List.Item title="You have no friends. Try searching for some!" />
					</List.Section>
				)}
			</ScrollView>
			<Snackbar visible={isSnackbarVisible} onDismiss={onDismissSnackbar} duration={2000}>
				{snackbarMessage}
			</Snackbar>
		</View>
	);
}

FriendsPage.propTypes = {
	navigation: PropTypes.shape({
		navigate: PropTypes.func.isRequired,
	}).isRequired,
	setUserId: PropTypes.func.isRequired,
};
