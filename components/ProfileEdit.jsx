import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Modal, Avatar, Caption, Button, FAB, useTheme } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import { DetailsSchema } from '../schema';
import capitalise from '../helpers/strings';
import ErrorStyles from '../styles/error';
import ProfileStyles from '../styles/profile';
import Divider from './Divider';
import TextInput from './TextInput';

export default function ProfileEdit({ profilePhoto, user, visible, onDismiss, onSave }) {
	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm({ defaultValues: { firstName: '', lastName: '' }, resolver: yupResolver(DetailsSchema) });

	const theme = useTheme();

	const [stagedPhoto, setStagedPhoto] = useState('');

	const onSaveWithReset = data => {
		// reset forms in field before callback.
		reset();
		onSave({ ...user, ...data, profilePhoto: stagedPhoto });
		// reset staged avatar.
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

	useEffect(() => {
		setValue('firstName', user.firstName);
		setValue('lastName', user.lastName);
	}, [user]);

	return (
		<Modal contentContainerStyle={ProfileStyles(theme).modal} visible={visible} onDismiss={onDismiss}>
			<View style={ProfileStyles(theme).avatarWrapper}>
				<Avatar.Image size={144} style={ProfileStyles(theme).avatar} theme={theme} source={stagedPhoto || profilePhoto ? { uri: stagedPhoto || profilePhoto } : null} />
				<FAB style={ProfileStyles(theme).fab} color={theme.colors.primary} icon="cloud-upload" onPress={onPickImage} />
				<Divider text="Details" />
			</View>
			<View style={ProfileStyles(theme).wrapper}>
				<View>
					<TextInput control={control} name="firstName" label="First Name" />
					<Caption style={ErrorStyles(theme).caption}>{errors.firstName && capitalise(errors.firstName.message)}</Caption>
				</View>
				<View>
					<TextInput control={control} name="lastName" label="Last Name" />
					<Caption style={ErrorStyles(theme).caption}>{errors.lastName && capitalise(errors.lastName.message)}</Caption>
				</View>
			</View>
			<View style={ProfileStyles(theme).wrapper}>
				<Button icon="save" contentStyle={ProfileStyles(theme).button} onPress={handleSubmit(onSaveWithReset)} mode="contained">
					Save
				</Button>
			</View>
		</Modal>
	);
}

ProfileEdit.propTypes = {
	profilePhoto: PropTypes.string.isRequired,
	user: PropTypes.shape({
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
	}).isRequired,
	visible: PropTypes.bool.isRequired,
	onDismiss: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};
