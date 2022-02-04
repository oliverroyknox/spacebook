import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Card, TextInput, Button, useTheme,
} from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({ text: yup.string().required() });

const styles = ({ colors }) => StyleSheet.create({
  errors: {
    color: colors.error,
    minHeight: 20,
  },
  actions: {
    marginLeft: 'auto',
  },
  button: {
    flexDirection: 'row-reverse',
  },
});

export default function PostCompose({ onPost }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { text: '' },
    resolver: yupResolver(schema),
  });

  const theme = useTheme();

  /**
   * Handle resetting form before `onPost` callback.
   * @param {Object} data Form data.
   */
  const onPostWithReset = (data) => {
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
            <TextInput
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              placeholder="Write your post here..."
              mode="outlined"
              multiline
              numberOfLines={2}
            />
          )}
        />
      </Card.Content>
      <Card.Actions style={styles(theme).actions}>
        <Button
          icon="send"
          contentStyle={styles(theme).button}
          onPress={handleSubmit(onPostWithReset)}
        >
          Post
        </Button>
      </Card.Actions>
    </Card>
  );
}

PostCompose.propTypes = {
  onPost: PropTypes.func.isRequired,
};
