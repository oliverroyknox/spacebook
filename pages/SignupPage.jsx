import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import capitalise from '../helpers/strings';
import { login, signup } from '../helpers/requests';
import SignupAuthForm from '../components/SignupAuthForm';
import SignupDetailsForm from '../components/SignupDetailsForm';

const { width } = Dimensions.get('window');

const styles = ({ colors }) => StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    backgroundColor: colors.page,
  },
  swiperContainer: {
    flex: 1,
  },
  swiperSlide: {
    width,
  },
});

export default function SignupPage({ navigation, route }) {
  const tempData = { email: '', password: '' };

  const { onAuthenticate } = route.params;

  const theme = useTheme();

  const swiperRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Synchronises state when `Snackbar` is dismissed.
   */
  const onDismissSnackbar = () => setVisible(false);

  /**
   * Handle redirect to `Login` page.
   */
  const onLogin = () => navigation.navigate('Login');

  /**
   * Shows a `Snackbar` with the given message.
   * @param {string} message Message to display in `Snackbar`.
   */
  function showSnackbar(message) {
    setErrorMessage(capitalise(message));
    return setVisible(true);
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
          return onAuthenticate(loginResponse.body?.token);
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
    <View style={styles(theme).container}>
      <View style={styles(theme).swiperContainer}>
        <SwiperFlatList ref={swiperRef} disableGesture>
          <View style={styles(theme).swiperSlide}>
            <SignupAuthForm onContinue={onContinue} onLogin={onLogin} />
          </View>
          <View style={styles(theme).swiperSlide}>
            <SignupDetailsForm onSignup={onSignup} onGoBack={onScrollToPrev} />
          </View>
        </SwiperFlatList>
      </View>
      <Snackbar visible={visible} onDismiss={onDismissSnackbar}>
        {errorMessage}
      </Snackbar>
    </View>
  );
}

SignupPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      onAuthenticate: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
