import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	postList: {
		paddingHorizontal: 16,
	},
	postListContent: {
		marginBottom: 8,
	},
	postWrapper: {
		marginVertical: 8,
	},
	singleAction: {
		marginLeft: 'auto',
	},
	actions: {
		flex: 1,
		justifyContent: 'space-between',
	},
	actionsWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	button: {
		flexDirection: 'row-reverse',
		minHeight: 16,
	},
	badge: {
		marginRight: 8,
		alignSelf: 'auto',
	},
});

export default styles;
