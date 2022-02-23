import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
import { Searchbar, Snackbar, List, useTheme, IconButton, Caption } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchUsers } from '../api/requests';
import capitalise from '../helpers/strings';
import PageStyles from '../styles/page';
import SearchStyles from '../styles/search';
import PaginationStyles from '../styles/pagination';
import User from '../components/User';
import LimitPicker from '../components/LimitPicker';
import SearchInPicker from '../components/SearchInPicker';

export default function SearchPage({ navigation, setUserId }) {
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	const [searchQuery, setSearchQuery] = useState('');
	const [pageNum, setPageNum] = useState(0);
	const [isLoadingPage, setIsLoadingPage] = useState(false);
	const [hasPagePrev, setHasPagePrev] = useState(false);
	const [hasPageNext, setHasPageNext] = useState(false);
	const [users, setUsers] = useState([]);
	const [limit, setLimit] = useState(5);
	const [searchIn, setSearchIn] = useState('all');
	const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	async function checkNextPage() {
		// request the next page before needed to check there are some results and set state accordingly.
		const sessionToken = await AsyncStorage.getItem('session_token');
		const response = await searchUsers({
			sessionToken,
			query: searchQuery,
			offset: limit * (pageNum + 1),
			limit: limit,
			searchIn: searchIn,
		});

		if (response.ok) {
			setHasPageNext(response.body.length > 0);
		} else {
			setHasPageNext(false);
		}
	}

	async function checkPrevPage() {
		// lowest possible page is 0.
		setHasPagePrev(pageNum > 0);
	}

	const nextPage = async () => {
		if (hasPageNext && !isLoadingPage) {
			setPageNum(pageNum + 1);
			setIsLoadingPage(true);
		}
	};

	const prevPage = async () => {
		if (hasPagePrev && !isLoadingPage) {
			setPageNum(pageNum - 1);
			setIsLoadingPage(true);
		}
	};

	function showSnackbar(message) {
		setSnackbarMessage(capitalise(message));
		return setIsSnackbarVisible(true);
	}

	const onDismissSnackbar = () => setIsSnackbarVisible(false);

	const onSearch = async query => {
		const sessionToken = await AsyncStorage.getItem('session_token');
		const response = await searchUsers({
			sessionToken,
			query,
			offset: limit * pageNum,
			limit: limit,
			searchIn: searchIn,
		});

		if (response.ok) {
			// after loading new page, re-check pagination state.
			await checkNextPage();
			await checkPrevPage();

			return setUsers(response.body);
		}

		return showSnackbar(response.message);
	};

	const onSearchChange = async query => {
		setSearchQuery(query);
		await onSearch(query);
	};

	const onGoToUser = ({ userId }) => {
		setUserId(userId);
		navigation.navigate('Profile');
	};

	const onLimitChange = value => {
		setLimit(Number(value));
		setPageNum(0);
	};

	const onSearchInChange = value => {
		setSearchIn(value);
		setPageNum(0);
	};

	function renderUsers() {
		return users.map(({ userId, userGivenname, userFamilyname }) => (
			<User key={userId} userId={userId} firstName={userGivenname} lastName={userFamilyname} onGoToUser={onGoToUser} />
		));
	}

	useEffect(async () => {
		await onSearch('');
	}, []);

	useEffect(async () => {
		// when page number changes, perform a new search to load results on new page.
		await onSearch(searchQuery);
		setTimeout(() => setIsLoadingPage(false), 300);
	}, [pageNum]);

	useEffect(async () => onSearch(searchQuery), [limit, searchIn]);

	return (
		<View style={PageStyles(theme, insets).page}>
			<ScrollView>
				<View style={SearchStyles.searchWrapper}>
					<Searchbar placeholder="Search" onChangeText={onSearchChange} value={searchQuery} />
				</View>
				<View style={PaginationStyles.paginationWrapper}>
					<IconButton icon="arrow-back-circle" color={theme.colors.primary} disabled={!hasPagePrev} onPress={prevPage} />
					<Caption>Page {pageNum + 1}</Caption>
					<IconButton icon="arrow-forward-circle" color={theme.colors.primary} disabled={!hasPageNext} onPress={nextPage} />
				</View>
				<View style={PaginationStyles.settingsWrapper}>
					<View style={PaginationStyles.setting}>
						<Caption>Search In</Caption>
						<SearchInPicker value={searchIn} onChange={onSearchInChange} />
					</View>
					<View style={PaginationStyles.setting}>
						<Caption>Results Per Page</Caption>
						<LimitPicker value={limit} onChange={onLimitChange} />
					</View>
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
