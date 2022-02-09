import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import capitalise from '../helpers/strings';
import { login, signup } from '../helpers/requests';
import PageStyles from '../styles/page';
import SignupAuthForm from '../components/SignupAuthForm';
import SignupDetailsForm from '../components/SignupDetailsForm';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  swiperContainer: {
    flex: 1,
  },
  swiperSlide: {
    width,
  },
});

export default function SignupPage({ navigation, onAuthenticate }) {
  const tempData = { email: '', password: '' };

  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const swiperRef = useRef(null);

  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  /**
   * Synchronises state when `Snackbar` is dismissed.
   */
  const onDismissSnackbar = () => setIsSnackbarVisible(false);

  /**
   * Handle redirect to `Login` page.
   */
  const onLoginRedirect = () => navigation.navigate('Login');

  /**
   * Shows a `Snackbar` with the given message.
   * @param {string} message Message to display in `Snackbar`.
   */
  function showSnackbar(message) {
    setSnackbarMessage(capitalise(message));
    return setIsSnackbarVisible(true);
  }

  /**
   * Scroll swiper back to previous index.
   */
  const onScrollToPrev = () => {
    const index = swiperRef.current.getPrevIndex();
    swiperRef.current.scrollToIndex({ index });
  };

  /**
   * Handle partial form submission before navigating to next slide.
   */
  const onContinue = ({ email, password }) => {
    tempData.email = email;
    tempData.password = password;

    swiperRef.current.scrollToIndex({ index: 1 });
  };

  /**
   * Handle complete form submission to signup a new user account,
   * and automatically logs them in on successs.
   * @param {Object} data Form data.
   * @param {string} data.firstName First name of user.
   * @param {string} data.lastName Last name of user.
   */
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

        const loginResponse = await login({ email, password });
        if (loginResponse.ok) {
          return onAuthenticate({
            userId: loginResponse.body?.id,
            sessionToken: loginResponse.body?.token,
          });
        }

        // Fallback to login screen if problem with automatic login request.
        return navigation.goBack();
      }
      return showSnackbar(signupResponse.message);
    } catch (e) {
      return showSnackbar('failed to reach server.');
    }
  };

  return (
    <View style={PageStyles(theme, insets).page}>
      <View style={styles.swiperContainer}>
        <SwiperFlatList ref={swiperRef} disableGesture>
          <View style={styles.swiperSlide}>
            <SignupAuthForm
              onContinue={onContinue}
              onLoginRedirect={onLoginRedirect}
            />
          </View>
          <View style={styles.swiperSlide}>
            <SignupDetailsForm onSignup={onSignup} onGoBack={onScrollToPrev} />
          </View>
        </SwiperFlatList>
      </View>
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

SignupPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  onAuthenticate: PropTypes.func.isRequired,
};
