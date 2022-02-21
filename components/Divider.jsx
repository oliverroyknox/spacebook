import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Caption, useTheme } from 'react-native-paper';
import DividerStyles from '../styles/divider';

export default function Divider({ text }) {
	const theme = useTheme();

	return (
		<View style={DividerStyles(theme).container}>
			<View style={DividerStyles(theme).line} />
			<Caption>{text}</Caption>
			<View style={DividerStyles(theme).line} />
		</View>
	);
}

Divider.propTypes = {
	text: PropTypes.string.isRequired,
};
