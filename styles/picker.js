import { StyleSheet } from 'react-native';

const styles = ({ colors }) =>
	StyleSheet.create({
		picker: {
			height: 32,
			borderColor: colors.divider,
			borderRadius: 4,
		},
	});

export default styles;
