import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import { login } from '../helpers/requests';
import capitalise from '../helpers/strings';
import LoginForm from '../components/LoginForm';

const styles = ({ colors }) => StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    backgroundColor: colors.page,
  },
});

export default function LoginPage({ navigation, route }) {
  const { onAuthenticate } = route.params;

  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Synchronises state when `Snackbar` is dismissed.
   */
  const onDismissSnackbar = () => setVisible(false);

  /**
   * Handle redirect to `Signup` page.
   */
  const onSignupRedirect = () => navigation.navigate('Signup');

  /**
   * Shows a `Snackbar` with the given message.
   * @param {string} message Message to display in `Snackbar`.
   */
  function showSnackbar(message) {
    setErrorMessage(capitalise(message));
    return setVisible(true);
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
    <View style={styles(theme).container}>
      <LoginForm onLogin={onLogin} onSignupRedirect={onSignupRedirect} />
      <Snackbar visible={visible} onDismiss={onDismissSnackbar}>
        {errorMessage}
      </Snackbar>
    </View>
  );
}

LoginPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      onAuthenticate: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
