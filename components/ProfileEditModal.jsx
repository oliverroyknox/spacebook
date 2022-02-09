import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import {
  Modal, Avatar, Caption, Button, FAB, useTheme,
} from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import capitalise from '../helpers/strings';
import ErrorStyles from '../styles/error';
import Divider from './Divider';
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
  modal: {
    backgroundColor: colors.page,
    flex: 2 / 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
  },
  avatarWrapper: {
    paddingTop: 32,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    marginBottom: 32,
  },
  wrapper: {
    width: '100%',
  },
  button: {
    flexDirection: 'row-reverse',
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: '25%',
    backgroundColor: colors.page,
  },
});

export default function ProfileEditModal({
  profilePhoto,
  user,
  visible,
  onDismiss,
  onSave,
}) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const theme = useTheme();

  const [stagedPhoto, setStagedPhoto] = useState('');

  useEffect(() => {
    setValue('firstName', user.firstName);
    setValue('lastName', user.lastName);
  }, [user]);

  const onSaveWithReset = (data) => {
    reset();
    onSave({ ...user, ...data, profilePhoto: stagedPhoto });
    setStagedPhoto('');
  };

  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setStagedPhoto(result.uri);
    }
  };

  return (
    <Modal
      contentContainerStyle={styles(theme).modal}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View style={styles(theme).avatarWrapper}>
        <Avatar.Image
          size={144}
          style={styles(theme).avatar}
          theme={theme}
          source={{ uri: stagedPhoto || profilePhoto }}
        />
        <FAB style={styles(theme).fab} color={theme.colors.primary} icon="cloud-upload" onPress={onPickImage} />
        <Divider text="Details" />
      </View>
      <View style={styles(theme).wrapper}>
        <View>
          <TextInput control={control} name="firstName" label="First Name" />
          <Caption style={ErrorStyles(theme).caption}>
            {errors.firstName && capitalise(errors.firstName.message)}
          </Caption>
        </View>
        <View>
          <TextInput control={control} name="lastName" label="Last Name" />
          <Caption style={ErrorStyles(theme).caption}>
            {errors.lastName && capitalise(errors.lastName.message)}
          </Caption>
        </View>
      </View>
      <View style={styles(theme).wrapper}>
        <Button
          icon="save"
          contentStyle={styles(theme).button}
          onPress={handleSubmit(onSaveWithReset)}
          mode="contained"
        >
          Save
        </Button>
      </View>
    </Modal>
  );
}

ProfileEditModal.propTypes = {
  profilePhoto: PropTypes.string.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
