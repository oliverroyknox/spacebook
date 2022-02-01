import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Text, TextInput, View,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { login } from '../helpers/requests';
import capitalise from '../helpers/strings';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
}).required();

const defaultValues = {
  email: '',
  password: '',
};

export default function LoginPage({ route }) {
  const { onAuthenticate } = route.params;

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

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

    return console.log(response.message);
  };

  return (
    <View>
      <Text>Login</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />
      {errors.email && <Text>{capitalise(errors.email.message)}</Text>}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} secureTextEntry />
        )}
      />
      {errors.password && <Text>{capitalise(errors.password.message)}</Text>}
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
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
