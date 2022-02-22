import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { login } from '../api/requests';
import capitalise from '../helpers/strings';
import PageStyles from '../styles/page';
import LoginForm from '../components/LoginForm';

export default function LoginPage({ navigation, onAuthenticate }) {
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const onDismissSnackbar = () => setIsSnackbarVisible(false);

	const onSignupRedirect = () => navigation.navigate('Signup');

	function showSnackbar(message) {
		setSnackbarMessage(capitalise(message));
		return setIsSnackbarVisible(true);
	}
	const onLogin = async ({ email, password }) => {
		try {
			const response = await login({ email, password });
			if (response.ok) {
				return onAuthenticate({
					userId: response.body?.id,
					sessionToken: response.body?.token,
				});
			}
			return showSnackbar(response.message);
		} catch (e) {
			return showSnackbar('failed to login, try again later.');
		}
	};

	return (
		<View style={PageStyles(theme, insets).page}>
			<LoginForm onLogin={onLogin} onSignupRedirect={onSignupRedirect} />
			<Snackbar visible={isSnackbarVisible} onDismiss={onDismissSnackbar} duration={2000}>
				{snackbarMessage}
			</Snackbar>
		</View>
	);
}

LoginPage.propTypes = {
	navigation: PropTypes.shape({
		navigate: PropTypes.func.isRequired,
	}).isRequired,
	onAuthenticate: PropTypes.func.isRequired,
};
