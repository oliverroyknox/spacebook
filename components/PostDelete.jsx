import React from 'react';
import PropTypes from 'prop-types';
import { Button, Paragraph, Dialog, useTheme } from 'react-native-paper';
import PostStyles from '../styles/post';

export default function PostDelete({ post, visible, onDismiss, onDelete }) {
	const { colors } = useTheme();

	return (
		<Dialog visible={visible} onDismiss={onDismiss}>
			<Dialog.Title>Delete a Post?</Dialog.Title>
			<Dialog.Content>
				<Paragraph>Are you sure you want to delete this post?</Paragraph>
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={onDismiss}>Go Back</Button>
				<Button icon="trash" color={colors.error} contentStyle={PostStyles.button} onPress={() => onDelete(post)}>
					Delete
				</Button>
			</Dialog.Actions>
		</Dialog>
	);
}

PostDelete.propTypes = {
	post: PropTypes.shape({
		postId: PropTypes.number.isRequired,
	}).isRequired,
	visible: PropTypes.bool.isRequired,
	onDismiss: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};
