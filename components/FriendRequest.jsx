import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { List, TouchableRipple, useTheme } from 'react-native-paper';
import FriendRequestStyle from '../styles/friend-request';

export default function FriendRequest({ userId, firstName, lastName, onAccept, onDecline }) {
	const theme = useTheme();

	const renderListIconRight = ({ style }) => (
		<View style={FriendRequestStyle.listIconWrapper}>
			<TouchableRipple style={FriendRequestStyle.touchable} onPress={() => onAccept({ userId })}>
				<List.Icon color={theme.colors.success} style={style} icon="checkmark-circle" />
			</TouchableRipple>
			<TouchableRipple style={FriendRequestStyle.touchable} onPress={() => onDecline({ userId })}>
				<List.Icon color={theme.colors.error} style={style} icon="close-circle" />
			</TouchableRipple>
		</View>
	);

	return <List.Item title={`${firstName} ${lastName}`} right={renderListIconRight} />;
}

FriendRequest.propTypes = {
	userId: PropTypes.number.isRequired,
	firstName: PropTypes.string.isRequired,
	lastName: PropTypes.string.isRequired,
	onAccept: PropTypes.func.isRequired,
	onDecline: PropTypes.func.isRequired,
};
