import { StyleSheet } from 'react-native';

const styles = ({ colors }) =>
	StyleSheet.create({
		modal: {
			backgroundColor: colors.page,
			flex: 2 / 3,
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: 16,
			marginHorizontal: 16,
		},
		avatarWrapper: {
			paddingTop: 32,
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		avatar: {
			marginBottom: 32,
		},
		wrapper: {
			width: '100%',
		},
		container: {
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-around',
		},
		toolbar: {
			display: 'flex',
			width: '100%',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-end',
		},
		nameContainer: {
			marginTop: 16,
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
		},
		name: {
			fontSize: 28,
			marginHorizontal: 8,
		},
		button: {
			flexDirection: 'row-reverse',
		},
		fab: {
			position: 'absolute',
			right: 0,
			bottom: '25%',
			backgroundColor: colors.page,
		},
	});

export default styles;
