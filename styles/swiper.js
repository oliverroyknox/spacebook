import { StyleSheet, Dimensions } from 'react-native';

const styles = () => {
	const { width } = Dimensions.get('window');

	return StyleSheet.create({
		swiperContainer: {
			flex: 1,
		},
		swiperSlide: {
			width,
		},
	});
};

export default styles;
