import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Paragraph, useTheme } from 'react-native-paper';
import DraftStyles from '../styles/draft';

export default function Draft({ draft, onEdit, onDelete, onSchedule }) {
  const theme = useTheme();

  return (
    <Card mode="outlined" style={DraftStyles(theme).card}>
      <Card.Content>
        <Paragraph style={DraftStyles(theme).text}>{draft.text}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => onSchedule(draft)} icon="calendar">
          Schedule
        </Button>
        <Button onPress={() => onEdit(draft)} icon="create">
          Edit
        </Button>
        <Button onPress={() => onDelete(draft)} icon="trash" color={theme.colors.error}>
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );
}

Draft.propTypes = {
  draft: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSchedule: PropTypes.func.isRequired,
};
