import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import {
  Button, Caption, Title, Snackbar,
} from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { login } from '../helpers/requests';
import capitalise from '../helpers/strings';

import TextInput from '../components/TextInput';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
}).required();

const defaultValues = {
  email: '',
  password: '',
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  form: {
    gap: 32,
    width: '100%',
    marginBottom: 128,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    padding: 16,
  },
  error: {
    color: '#ff4646',
    minHeight: 20,
  },
  submit: {
    marginTop: 32,
  },
});

export default function LoginPage({ route }) {
  const { onAuthenticate } = route.params;

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Synchronises state when `Snackbar` is dismissed.
   */
  const onDismissSnackbar = () => setVisible(false);

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

    setErrorMessage(capitalise(response.message));
    return setVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Title style={styles.title}>Login</Title>
        <View>
          <TextInput control={control} name="email" label="Email" />
          <Caption style={styles.error}>
            {errors.email && capitalise(errors.email.message)}
          </Caption>
        </View>
        <View>
          <TextInput control={control} name="password" label="Password" secureTextEntry />
          <Caption style={styles.error}>
            {errors.password && capitalise(errors.password.message)}
          </Caption>
        </View>
        <Button style={styles.submit} onPress={handleSubmit(onSubmit)} mode="contained">Login</Button>
      </View>
      <Snackbar visible={visible} onDismiss={onDismissSnackbar}>{errorMessage}</Snackbar>
    </View>

  );
}

LoginPage.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      onAuthenticate: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
