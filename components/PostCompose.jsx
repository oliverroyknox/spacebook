import React from 'react';
import PropTypes from 'prop-types';
import { Card, TextInput, Button } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PostSchema } from '../schema';
import PostStyles from '../styles/post';

export default function PostCompose({ onPost }) {
	const { control, handleSubmit, reset } = useForm({ defaultValues: { text: '' }, resolver: yupResolver(PostSchema) });

	/**
	 * Handle resetting form before `onPost` callback.
	 * @param {Object} data Form data.
	 */
	const onPostWithReset = data => {
		reset();
		onPost(data);
	};

	return (
		<Card mode="outlined">
			<Card.Content>
				<Controller
					control={control}
					name="text"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput onBlur={onBlur} onChange={onChange} value={value} placeholder="Write your post here..." mode="outlined" multiline numberOfLines={2} />
					)}
				/>
			</Card.Content>
			<Card.Actions style={PostStyles.singleAction}>
				<Button icon="send" contentStyle={PostStyles.button} onPress={handleSubmit(onPostWithReset)}>
					Post
				</Button>
			</Card.Actions>
		</Card>
	);
}

PostCompose.propTypes = {
	onPost: PropTypes.func.isRequired,
};
