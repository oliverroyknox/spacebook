import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Card, TextInput, Button,
} from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({ text: yup.string().required() });

const styles = StyleSheet.create({
  actions: {
    marginLeft: 'auto',
  },
  button: {
    flexDirection: 'row-reverse',
  },
});

export default function PostEdit({ post, onSave }) {
  const {
    control, handleSubmit, setValue, reset,
  } = useForm({
    defaultValues: { text: '' },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue('text', post.text);
  }, []);

  const onSaveWithReset = (data) => {
    reset();
    onSave(data);
  };

  return (
    <Card mode="outlined">
      <Card.Title title="Editing Post" />
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
              numberOfLines={4}
            />
          )}
        />
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          icon="save"
          contentStyle={styles.button}
          onPress={handleSubmit(onSaveWithReset)}
        >
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
