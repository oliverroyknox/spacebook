import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { Modal, Paragraph, Title, useTheme } from 'react-native-paper';
import Draft from './Draft';
import DraftStyles from '../styles/draft';

export default function DraftView({ visible, onDismiss, drafts, onEditDraft, onDeleteDraft }) {
  const theme = useTheme();

  function renderDraft({ item: draft }) {
    return <Draft draft={draft} onEdit={onEditDraft} onDelete={onDeleteDraft} />;
  }

  return (
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={DraftStyles(theme).modal}>
      <Title>Drafts</Title>
      {drafts.length > 0 ? (
        <FlatList
          style={DraftStyles(theme).list}
          data={drafts}
          renderItem={renderDraft}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Paragraph>No drafts saved.</Paragraph>
      )}
    </Modal>
  );
}

DraftView.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  drafts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};
