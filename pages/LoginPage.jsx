import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Caption,
  Title,
  Paragraph,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { login } from '../helpers/requests';
import capitalise from '../helpers/strings';

import TextInput from '../components/TextInput';

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  })
  .required();

const defaultValues = {
  email: '',
  password: '',
};

const styles = ({ colors }) => StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: colors.page,
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 16,
    width: '100%',
    height: '100%',
  },
  formContent: {
    width: '100%',
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: 'auto',
  },
  error: {
    color: colors.error,
    minHeight: 20,
  },
  signup: {
    color: colors.primary,
  },
});

export default function LoginPage({ navigation, route }) {
  const { onAuthenticate } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

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
  const onSignup = () => navigation.navigate('Signup');

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
  const onSubmit = async ({ email, password }) => {
    const response = await login({ email, password });

    if (response.ok) {
      return onAuthenticate(response.body?.token);
    }

    return showSnackbar(response.message);
  };

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).form}>
        <Title style={styles(theme).title}>Login</Title>
        <View style={styles(theme).formContent}>
          <View>
            <TextInput control={control} name="email" label="Email" />
            <Caption style={styles(theme).error}>
              {errors.email && capitalise(errors.email.message)}
            </Caption>
          </View>
          <View>
            <TextInput
              control={control}
              name="password"
              label="Password"
              secureTextEntry
            />
            <Caption style={styles(theme).error}>
              {errors.password && capitalise(errors.password.message)}
            </Caption>
          </View>
        </View>
        <View style={styles(theme).formContent}>
          <Button onPress={handleSubmit(onSubmit)} mode="contained">
            Login
          </Button>
          <Paragraph style={styles(theme).signup} onPress={onSignup}>
            Or if you don&apos;t have an account, sign up!
          </Paragraph>
        </View>
      </View>
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
