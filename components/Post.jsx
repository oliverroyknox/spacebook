import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
  Card,
  Caption,
  Paragraph,
  Button,
  Badge,
  Menu,
  IconButton,
  useTheme,
} from 'react-native-paper';
import PostStyles from '../styles/post';

export default function Post({ post, onLike, onPress, onEdit, onDelete, isFocused }) {
  const theme = useTheme();

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const openMenu = () => setIsMenuVisible(true);
  const closeMenu = () => setIsMenuVisible(false);

  function formatDate(unix) {
    // create a user friendly date string from timestamp.
    return new Date(unix).toLocaleString('en-GB');
  }

  const handleMenuPress = (callback) => {
    // enforce menu is closed before performing callback.
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
      <Card.Actions style={PostStyles.actions}>
        {onEdit || onDelete ? (
          <Menu
            visible={isMenuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="ellipsis-horizontal"
                style={{ marginRight: 'auto' }}
                color={theme.colors.primary}
                onPress={openMenu}
              />
            }
          >
            {onEdit && (
              <Menu.Item onPress={() => handleMenuPress(onEdit)} icon="create" title="Edit Post" />
            )}
            {onDelete && (
              <Menu.Item
                onPress={() => handleMenuPress(onDelete)}
                icon="trash"
                title="Delete Post"
              />
            )}
          </Menu>
        ) : (
          <View />
        )}
        <View style={PostStyles.actionsWrapper}>
          {onLike && (
            <Button icon="heart" contentStyle={PostStyles.button} onPress={() => onLike({ post })}>
              Like
            </Button>
          )}
          <Badge style={PostStyles.badge}>{post.numLikes}</Badge>
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
