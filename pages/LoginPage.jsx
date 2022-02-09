import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { login } from '../helpers/requests';
import capitalise from '../helpers/strings';
import PageStyles from '../styles/page';
import LoginForm from '../components/LoginForm';

export default function LoginPage({ navigation, onAuthenticate }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  /**
   * Synchronises state when `Snackbar` is dismissed.
   */
  const onDismissSnackbar = () => setIsSnackbarVisible(false);

  /**
   * Handle redirect to `Signup` page.
   */
  const onSignupRedirect = () => navigation.navigate('Signup');

  /**
   * Shows a `Snackbar` with the given message.
   * @param {string} message Message to display in `Snackbar`.
   */
  function showSnackbar(message) {
    setSnackbarMessage(capitalise(message));
    return setIsSnackbarVisible(true);
  }

  /**
   * Handle form submission by logging in a user account and authenticating in the system.
   * @param {Object} data Form data.
   * @param {string} data.email Email for user's account.
   * @param {string} data.password Password for user's account.
   */
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
      return showSnackbar('failed to reach server.');
    }
  };

  return (
    <View style={PageStyles(theme, insets).page}>
      <LoginForm onLogin={onLogin} onSignupRedirect={onSignupRedirect} />
      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={2000}
      >
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
