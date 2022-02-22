import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import capitalise from '../helpers/strings';
import { login, signup } from '../api/requests';
import PageStyles from '../styles/page';
import SwiperStyles from '../styles/swiper';
import SignupAuthForm from '../components/SignupAuthForm';
import SignupDetailsForm from '../components/SignupDetailsForm';

export default function SignupPage({ navigation, onAuthenticate }) {
	const tempData = { email: '', password: '' };

	const theme = useTheme();
	const insets = useSafeAreaInsets();

	const swiperRef = useRef(null);

	const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const onDismissSnackbar = () => setIsSnackbarVisible(false);

	const onLoginRedirect = () => navigation.navigate('Login');

	function showSnackbar(message) {
		setSnackbarMessage(capitalise(message));
		return setIsSnackbarVisible(true);
	}

	const onScrollToPrev = () => {
		const index = swiperRef.current.getPrevIndex();
		swiperRef.current.scrollToIndex({ index });
	};

	const onContinue = ({ email, password }) => {
		tempData.email = email;
		tempData.password = password;

		swiperRef.current.scrollToIndex({ index: 1 });
	};

	const onSignup = async ({ firstName, lastName }) => {
		const { email, password } = tempData;

		try {
			const signupResponse = await signup({
				email,
				password,
				firstName,
				lastName,
			});
			if (signupResponse.ok) {
				showSnackbar(capitalise(signupResponse.message));

				// if signup is successful, then automatically log in the user.
				const loginResponse = await login({ email, password });
				if (loginResponse.ok) {
					return onAuthenticate({
						userId: loginResponse.body?.id,
						sessionToken: loginResponse.body?.token,
					});
				}

				// fallback to login screen if problem with automatic login request.
				return navigation.goBack();
			}
			return showSnackbar(signupResponse.message);
		} catch (e) {
			return showSnackbar('failed to signup, try again later.');
		}
	};

	return (
		<View style={PageStyles(theme, insets).page}>
			<View style={SwiperStyles().swiperContainer}>
				<SwiperFlatList ref={swiperRef} disableGesture>
					<View style={SwiperStyles().swiperSlide}>
						<SignupAuthForm onContinue={onContinue} onLoginRedirect={onLoginRedirect} />
					</View>
					<View style={SwiperStyles().swiperSlide}>
						<SignupDetailsForm onSignup={onSignup} onGoBack={onScrollToPrev} />
					</View>
				</SwiperFlatList>
			</View>
			<Snackbar visible={isSnackbarVisible} onDismiss={onDismissSnackbar} duration={2000}>
				{snackbarMessage}
			</Snackbar>
		</View>
	);
}

SignupPage.propTypes = {
	navigation: PropTypes.shape({
		navigate: PropTypes.func.isRequired,
		goBack: PropTypes.func.isRequired,
	}).isRequired,
	onAuthenticate: PropTypes.func.isRequired,
};
