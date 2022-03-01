import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Title, Caption, Paragraph, Button, useTheme } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchema } from '../schema';
import capitalise from '../helpers/strings';
import FormStyles from '../styles/form';
import ErrorStyles from '../styles/error';
import LinkStyles from '../styles/link';
import TextInput from './TextInput';

export default function LoginForm({ onLogin, onSignupRedirect }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' }, resolver: yupResolver(LoginSchema) });

  const theme = useTheme();

  return (
    <View style={FormStyles.container}>
      <Title style={FormStyles.title}>Login</Title>
      <View style={FormStyles.content}>
        <View style={FormStyles.item}>
          <TextInput control={control} name="email" label="Email" />
          <Caption style={ErrorStyles(theme).caption}>
            {errors.email && capitalise(errors.email.message)}
          </Caption>
        </View>
        <View style={FormStyles.item}>
          <TextInput control={control} name="password" label="Password" secureTextEntry />
          <Caption style={ErrorStyles(theme).caption}>
            {errors.password && capitalise(errors.password.message)}
          </Caption>
        </View>
      </View>
      <View style={FormStyles.content}>
        <Button onPress={handleSubmit(onLogin)} mode="contained">
          Login
        </Button>
        <Paragraph style={LinkStyles(theme).text} onPress={onSignupRedirect}>
          Or if you don&apos;t have an account, sign up!
        </Paragraph>
      </View>
    </View>
  );
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onSignupRedirect: PropTypes.func.isRequired,
};
