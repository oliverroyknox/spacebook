import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import {
  Title,
  Caption,
  Paragraph,
  Button,
  useTheme,
} from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import capitalise from '../helpers/strings';
import formStyles from '../styles/form';
import TextInput from './TextInput';

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(5).required(),
  })
  .required();

const defaultValues = {
  email: '',
  password: '',
};

const styles = ({ colors }) => StyleSheet.create({
  error: {
    color: colors.error,
    minHeight: 20,
  },
  login: { color: colors.primary },
});

export default function SignupAuthForm({ onContinue, onLoginRedirect }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const theme = useTheme();

  return (
    <View style={formStyles.container}>
      <Title style={formStyles.title}>Sign Up</Title>
      <View style={formStyles.content}>
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
      <View style={formStyles.content}>
        <Button onPress={handleSubmit(onContinue)} mode="contained">
          Continue
        </Button>
        <Paragraph style={styles(theme).login} onPress={onLoginRedirect}>
          Or if you already have an account, login.
        </Paragraph>
      </View>
    </View>
  );
}

SignupAuthForm.propTypes = {
  onContinue: PropTypes.func.isRequired,
  onLoginRedirect: PropTypes.func.isRequired,
};
