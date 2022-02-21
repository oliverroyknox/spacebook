import { StyleSheet } from 'react-native';

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

export default styles;
