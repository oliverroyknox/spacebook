import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Card, Caption, Paragraph, Button, Badge,
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
    marginLeft: 'auto',
  },
  button: {
    flexDirection: 'row-reverse',
    minHeight: 16,
  },
  badge: {
    marginRight: 8,
  },
});

export default function Post({
  post, onLike, onPress, isFocused,
}) {
  function formatDate(unix) {
    return new Date(unix).toLocaleString('en-GB');
  }

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
  onPress: PropTypes.func,
  isFocused: PropTypes.bool,
};

Post.defaultProps = {
  onPress: () => null,
  isFocused: false,
};
