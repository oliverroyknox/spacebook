import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Card, Caption, Paragraph, Button, Badge, Menu, IconButton, useTheme,
} from 'react-native-paper';

const styles = StyleSheet.create({
  overflow: {
    display: '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actions: {
    flex: 1,
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row-reverse',
    minHeight: 16,
  },
  badge: {
    marginRight: 8,
  },
});

// TODO: Decide how post can be liked.
// Posts on your own profile cannot be liked.
// Only friends posts on other profiles can be liked.

export default function Post({
  post, onLike, onPress, onEdit, onDelete, isFocused,
}) {
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
  const handleMenuPress = (callback) => {
    closeMenu();
    callback();
  };

  return (
    <Card mode="outlined" onPress={() => onPress({ post })}>
      <Card.Content>
        <Caption>
          {post.author.firstName}
          {' '}
          {post.author.lastName}
          {' '}
          on
          {' '}
          {formatDate(post.timestamp)}
        </Caption>
        <Paragraph style={!isFocused && styles.overflow}>{post.text}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Menu
          visible={isMenuVisible}
          onDismiss={closeMenu}
          anchor={<IconButton icon="ellipsis-horizontal" style={{ marginRight: 'auto' }} color={theme.colors.primary} onPress={openMenu} />}
        >
          <Menu.Item onPress={() => handleMenuPress(onEdit)} icon="create" title="Edit Post" />
          <Menu.Item onPress={() => handleMenuPress(onDelete)} icon="trash" title="Delete Post" />
        </Menu>
        <Button icon="heart" contentStyle={styles.button} onPress={() => onLike({ post })}>
          <Badge style={styles.badge}>{post.numLikes}</Badge>
          Like
        </Button>
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
  onLike: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onPress: PropTypes.func,
  isFocused: PropTypes.bool,
};

Post.defaultProps = {
  onPress: () => null,
  onEdit: () => null,
  onDelete: () => null,
  isFocused: false,
};
