import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Button, Paragraph, Dialog, useTheme,
} from 'react-native-paper';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row-reverse',
  },
});

export default function PostDeleteDialog({
  post, visible, onDismiss, onDelete,
}) {
  const { colors } = useTheme();

  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>Delete a Post?</Dialog.Title>
      <Dialog.Content>
        <Paragraph>Are you sure you want to delete this post?</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Go Back</Button>
        <Button icon="trash" color={colors.error} contentStyle={styles.button} onPress={() => onDelete(post)}>Delete</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

PostDeleteDialog.propTypes = {
  post: PropTypes.shape({
    postId: PropTypes.number.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
