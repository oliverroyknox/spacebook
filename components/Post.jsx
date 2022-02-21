import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Card, Caption, Paragraph, Button, Badge, Menu, IconButton, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
	actions: {
		flex: 1,
		justifyContent: 'space-between',
	},
	actionsWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	button: {
		flexDirection: 'row-reverse',
		minHeight: 16,
	},
	badge: {
		marginRight: 8,
		alignSelf: 'auto',
	},
});

export default function Post({ post, onLike, onPress, onEdit, onDelete, isFocused }) {
	const theme = useTheme();

	const [isMenuVisible, setIsMenuVisible] = useState(false);

	const openMenu = () => setIsMenuVisible(true);
	const closeMenu = () => setIsMenuVisible(false);

	function formatDate(unix) {
		return new Date(unix).toLocaleString('en-GB');
	}

	/**
	 * Wrapper for a callback on `Menu.Item` press. Closes the `Menu` before running callback.
	 * @param {Function} callback Callback to run on menu item press.
	 */
	const handleMenuPress = callback => {
		closeMenu();
		callback({ post });
	};

	return (
		<Card mode="outlined" onPress={() => onPress({ post })}>
			<Card.Content>
				<Caption>
					{post.author.firstName} {post.author.lastName} on {formatDate(post.timestamp)}
				</Caption>
				{isFocused ? (
					<Paragraph>{post.text}</Paragraph>
				) : (
					<Paragraph numberOfLines={3} ellipsizeMode="tail">
						{post.text}
					</Paragraph>
				)}
			</Card.Content>
			<Card.Actions style={styles.actions}>
				{onEdit || onDelete ? (
					<Menu
						visible={isMenuVisible}
						onDismiss={closeMenu}
						anchor={<IconButton icon="ellipsis-horizontal" style={{ marginRight: 'auto' }} color={theme.colors.primary} onPress={openMenu} />}
					>
						{onEdit && <Menu.Item onPress={() => handleMenuPress(onEdit)} icon="create" title="Edit Post" />}
						{onDelete && <Menu.Item onPress={() => handleMenuPress(onDelete)} icon="trash" title="Delete Post" />}
					</Menu>
				) : (
					<View />
				)}
				<View style={styles.actionsWrapper}>
					{onLike && (
						<Button icon="heart" contentStyle={styles.button} onPress={() => onLike({ post })}>
							Like
						</Button>
					)}
					<Badge style={styles.badge}>{post.numLikes}</Badge>
				</View>
			</Card.Actions>
		</Card>
	);
}

Post.propTypes = {
	post: PropTypes.shape({
		postId: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired,
		timestamp: PropTypes.string.isRequired,
		author: PropTypes.shape({
			userId: PropTypes.number.isRequired,
			firstName: PropTypes.string.isRequired,
			lastName: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
		}).isRequired,
		numLikes: PropTypes.number.isRequired,
	}).isRequired,
	onLike: PropTypes.func,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	onPress: PropTypes.func,
	isFocused: PropTypes.bool,
};

Post.defaultProps = {
	onLike: null,
	onPress: () => null,
	onEdit: null,
	onDelete: null,
	isFocused: false,
};
