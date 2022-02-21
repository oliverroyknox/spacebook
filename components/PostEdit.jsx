import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, TextInput, Button } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PostStyles from '../styles/post';

const schema = yup.object({ text: yup.string().required() });

export default function PostEdit({ post, onSave }) {
	const { control, handleSubmit, setValue, reset } = useForm({
		defaultValues: { text: '' },
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		setValue('text', post.text);
	}, []);

	const onSaveWithReset = data => {
		reset();
		onSave({ ...post, ...data });
	};

	return (
		<Card mode="outlined">
			<Card.Title title="Editing Post" />
			<Card.Content>
				<Controller
					control={control}
					name="text"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput onBlur={onBlur} onChange={onChange} value={value} placeholder="Write your post here..." mode="outlined" multiline numberOfLines={4} />
					)}
				/>
			</Card.Content>
			<Card.Actions style={PostStyles.actions}>
				<Button icon="save" contentStyle={PostStyles.button} onPress={handleSubmit(onSaveWithReset)}>
					Save
				</Button>
			</Card.Actions>
		</Card>
	);
}

PostEdit.propTypes = {
	post: PropTypes.shape({
		text: PropTypes.string.isRequired,
	}).isRequired,
	onSave: PropTypes.func.isRequired,
};
