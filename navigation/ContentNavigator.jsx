import React from 'react';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfilePage from '../pages/ProfilePage';
import SearchPage from '../pages/SearchPage';
import FriendsPage from '../pages/FriendsPage';

const Tab = createBottomTabNavigator();

function renderTabBarIcon(route, options) {
	const { name } = route;
	const { size, color } = options;

	// render different tab bar icon based on route path.
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

const setTabNavigatorScreenOptions = ({ route }) => ({
	tabBarIcon: options => renderTabBarIcon(route, options),
	tabBarLabelPosition: 'below-icon',
	tabBarStyle: { marginBottom: 4 },
	headerShown: false,
});

export default function ContentNavigator({ userId, setUserId, onUnauthenticate }) {
	const renderProfilePage = () => <ProfilePage userId={userId} setUserId={setUserId} onUnauthenticate={onUnauthenticate} />;

	const renderSearchPage = ({ navigation }) => <SearchPage navigation={navigation} setUserId={setUserId} />;

	const renderFriendsPage = ({ navigation }) => <FriendsPage navigation={navigation} setUserId={setUserId} />;

	return (
		<Tab.Navigator screenOptions={setTabNavigatorScreenOptions}>
			<Tab.Screen name="Profile">{renderProfilePage}</Tab.Screen>
			<Tab.Screen name="Search">{renderSearchPage}</Tab.Screen>
			<Tab.Screen name="Friends">{renderFriendsPage}</Tab.Screen>
		</Tab.Navigator>
	);
}

ContentNavigator.propTypes = {
	userId: PropTypes.number.isRequired,
	setUserId: PropTypes.func.isRequired,
	onUnauthenticate: PropTypes.func.isRequired,
};
