import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingVertical: 24,
		paddingHorizontal: 32,
		width: '100%',
		height: '100%',
	},
	content: {
		width: '100%',
		marginVertical: 16,
	},
	item: {
		marginVertical: 8,
	},
	title: {
		fontSize: 32,
		fontWeight: '700',
		marginRight: 'auto',
	},
});

export default styles;
