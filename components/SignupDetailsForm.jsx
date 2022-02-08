import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import {
  Title,
  Caption,
  Button,
  useTheme,
} from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import capitalise from '../helpers/strings';
import FormStyles from '../styles/form';
import ErrorStyles from '../styles/error';
import TextInput from './TextInput';

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
  })
  .required();

const defaultValues = {
  firstName: '',
  lastName: '',
};

const styles = StyleSheet.create({
  titleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    marginRight: 8,
  },
  signup: {
    marginBottom: 24,
  },
});

export default function SignupDetailsForm({ onSignup, onGoBack }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const theme = useTheme();

  return (
    <View style={FormStyles.container}>
      <View style={styles.titleContainer}>
        { onGoBack && <Ionicons style={styles.icon} name="arrow-back" size={32} color="black" onPress={onGoBack} /> }
        <Title style={FormStyles.title}>Details</Title>
      </View>
      <View style={FormStyles.content}>
        <View style={FormStyles.item}>
          <TextInput control={control} name="firstName" label="First Name" />
          <Caption style={ErrorStyles(theme).caption}>
            {errors.firstName && capitalise(errors.firstName.message)}
          </Caption>
        </View>
        <View style={FormStyles.item}>
          <TextInput control={control} name="lastName" label="Last Name" />
          <Caption style={ErrorStyles(theme).caption}>
            {errors.lastName && capitalise(errors.lastName.message)}
          </Caption>
        </View>
      </View>
      <View style={FormStyles.content}>
        <Button style={styles.signup} onPress={handleSubmit(onSignup)} mode="contained">
          Continue
        </Button>
      </View>
    </View>
  );
}

SignupDetailsForm.propTypes = {
  onSignup: PropTypes.func.isRequired,
  onGoBack: PropTypes.func,
};

SignupDetailsForm.defaultProps = {
  onGoBack: null,
};
