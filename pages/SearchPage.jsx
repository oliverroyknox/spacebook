import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Searchbar, Snackbar, List, useTheme, IconButton, Caption } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchUsers } from '../helpers/requests';
import PageStyles from '../styles/page';
import capitalise from '../helpers/strings';
import User from '../components/User';

const styles = StyleSheet.create({
	searchWrapper: {
		padding: 16,
	},
	paginationWrapper: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginHorizontal: '25%',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

const LIMIT = 10;

export default function SearchPage({ navigation, setUserId }) {
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	const [searchQuery, setSearchQuery] = useState('');
	const [pageNum, setPageNum] = useState(0);
	const [isLoadingPage, setIsLoadingPage] = useState(false);
	const [hasPagePrev, setHasPagePrev] = useState(false);
	const [hasPageNext, setHasPageNext] = useState(false);
	const [users, setUsers] = useState([]);
	const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	/**
	 * Check if there is a next page.
	 */
	async function checkNextPage() {
		const sessionToken = await AsyncStorage.getItem('session_token');
		const response = await searchUsers({
			sessionToken,
			query: searchQuery,
			offset: LIMIT * (pageNum + 1),
			limit: LIMIT,
		});

		if (response.ok) {
			setHasPageNext(response.body.length > 0);
		} else {
			setHasPageNext(false);
		}
	}

	/**
	 * Check if there is a previous page.
	 */
	async function checkPrevPage() {
		setHasPagePrev(pageNum > 0);
	}

	/**
	 * Load next page.
	 */
	const nextPage = async () => {
		if (hasPageNext && !isLoadingPage) {
			setPageNum(pageNum + 1);
			setIsLoadingPage(true);
		}
	};

	/**
	 * Load previous page.
	 */
	const prevPage = async () => {
		if (hasPagePrev && !isLoadingPage) {
			setPageNum(pageNum - 1);
			setIsLoadingPage(true);
		}
	};

	/**
	 * Shows a `Snackbar` with the given message.
	 * @param {string} message Message to display in `Snackbar`.
	 */
	function showSnackbar(message) {
		setSnackbarMessage(capitalise(message));
		return setIsSnackbarVisible(true);
	}

	/**
	 * Synchronises state when `Snackbar` is dismissed.
	 */
	const onDismissSnackbar = () => setIsSnackbarVisible(false);

	/**
	 * Handles searching for users from query string.
	 * @param {string} query Query to use in search.
	 */
	const onSearch = async query => {
		const sessionToken = await AsyncStorage.getItem('session_token');
		const response = await searchUsers({
			sessionToken,
			query,
			offset: LIMIT * pageNum,
			limit: LIMIT,
		});

		if (response.ok) {
			await checkNextPage();
			await checkPrevPage();

			return setUsers(response.body);
		}

		return showSnackbar(response.message);
	};

	/**
	 * Handles updating the search query state and performing a search.
	 * @param {string} query Query to use in search.
	 */
	const onSearchChange = async query => {
		setSearchQuery(query);
		await onSearch(query);
	};

	/**
	 * Navigates to the current user's profile.
	 * @param {Object} data User data.
	 * @param {number} data.userId ID of user to navigate to.
	 */
	const onGoToUser = ({ userId }) => {
		setUserId(userId);
		navigation.navigate('Profile');
	};

	/**
	 * Renders a list of user items.
	 * @returns A list of `List.Item` representing users.
	 */
	function renderUsers() {
		return users.map(({ userId, userGivenname, userFamilyname }) => (
			<User key={userId} userId={userId} firstName={userGivenname} lastName={userFamilyname} onGoToUser={onGoToUser} />
		));
	}

	useEffect(async () => {
		await onSearch('');
	}, []);

	useEffect(async () => {
		await onSearch(searchQuery);
		setTimeout(() => setIsLoadingPage(false), 300);
	}, [pageNum]);

	return (
		<View style={PageStyles(theme, insets).page}>
			<ScrollView>
				<View style={styles.searchWrapper}>
					<Searchbar placeholder="Search" onChangeText={onSearchChange} value={searchQuery} />
				</View>
				<View style={styles.paginationWrapper}>
					<IconButton icon="arrow-back-circle" color={theme.colors.primary} disabled={!hasPagePrev} onPress={prevPage} />
					<Caption>Page {pageNum + 1}</Caption>
					<IconButton icon="arrow-forward-circle" color={theme.colors.primary} disabled={!hasPageNext} onPress={nextPage} />
				</View>
				<List.Section>
					<List.Subheader>Suggestions</List.Subheader>
					{renderUsers()}
				</List.Section>
			</ScrollView>
			<Snackbar visible={isSnackbarVisible} onDismiss={onDismissSnackbar} duration={2000}>
				{snackbarMessage}
			</Snackbar>
		</View>
	);
}

SearchPage.propTypes = {
	navigation: PropTypes.shape({
		navigate: PropTypes.func.isRequired,
	}).isRequired,
	setUserId: PropTypes.func.isRequired,
};
