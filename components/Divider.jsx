import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Caption, useTheme } from 'react-native-paper';

const styles = ({ colors }) =>
	StyleSheet.create({
		container: {
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
		},
		line: {
			flex: 1,
			height: 1,
			marginHorizontal: 8,
			backgroundColor: colors.divider,
		},
	});

export default function Divider({ text }) {
	const theme = useTheme();

	return (
		<View style={styles(theme).container}>
			<View style={styles(theme).line} />
			<Caption>{text}</Caption>
			<View style={styles(theme).line} />
		</View>
	);
}

Divider.propTypes = {
	text: PropTypes.string.isRequired,
};
