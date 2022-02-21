import { StyleSheet } from 'react-native';

const styles = ({ colors }, insets) =>
	StyleSheet.create({
		page: {
			height: '100%',
			flex: 1,
			paddingTop: insets.top, // TODO replace with safe area provider
			backgroundColor: colors.page,
		},
		spacing: {
			marginVertical: 8,
		},
		alignment: {
			marginHorizontal: 16,
		},
	});

export default styles;
