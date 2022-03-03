import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, TextInput, Button } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PostSchema } from '../schema';
import PostStyles from '../styles/post';

export default function PostCompose({ text, onPost, onSaveDraft }) {
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: { text: '' },
    resolver: yupResolver(PostSchema),
  });

  const onPostWithReset = (data) => {
    // reset fields in form before callback.
    reset();
    onPost(data);
  };

  const onSaveDraftWithReset = (data) => {
    reset();
    onSaveDraft(data);
  };

  useEffect(() => {
    setValue('text', text);
  }, [text]);

  return (
    <Card mode="outlined">
      <Card.Content>
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Write your post here..."
              mode="outlined"
              multiline
              numberOfLines={2}
            />
          )}
        />
      </Card.Content>
      <Card.Actions style={PostStyles.actions}>
        <Button
          icon="save"
          contentStyle={PostStyles.button}
          onPress={handleSubmit(onSaveDraftWithReset)}
        >
          Save Draft
        </Button>
        <Button
          icon="send"
          contentStyle={PostStyles.button}
          onPress={handleSubmit(onPostWithReset)}
        >
          Post
        </Button>
      </Card.Actions>
    </Card>
  );
}

PostCompose.propTypes = {
  text: PropTypes.string.isRequired,
  onPost: PropTypes.func.isRequired,
  onSaveDraft: PropTypes.func.isRequired,
};
