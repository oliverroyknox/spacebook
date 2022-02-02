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
import formStyles from '../styles/form';
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

const styles = ({ colors }) => StyleSheet.create({
  titleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  error: {
    color: colors.error,
    minHeight: 20,
  },
  signup: {
    marginBottom: 32,
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
    <View style={formStyles.container}>
      <View style={styles(theme).titleContainer}>
        { onGoBack && <Ionicons name="arrow-back" size={32} color="black" onPress={onGoBack} /> }
        <Title style={formStyles.title}>Details</Title>
      </View>
      <View style={formStyles.content}>
        <View>
          <TextInput control={control} name="firstName" label="First Name" />
          <Caption style={styles(theme).error}>
            {errors.firstName && capitalise(errors.firstName.message)}
          </Caption>
        </View>
        <View>
          <TextInput control={control} name="lastName" label="Last Name" />
          <Caption style={styles(theme).error}>
            {errors.lastName && capitalise(errors.lastName.message)}
          </Caption>
        </View>
      </View>
      <View style={formStyles.content}>
        <Button style={styles(theme).signup} onPress={handleSubmit(onSignup)} mode="contained">
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
