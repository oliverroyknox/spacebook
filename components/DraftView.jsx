import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import { Portal, Modal, Paragraph, Title, useTheme, Button } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import Draft from './Draft';
import DraftStyles from '../styles/draft';

export default function DraftView({ visible, onDismiss, drafts, onEditDraft, onDeleteDraft }) {
  const theme = useTheme();

  const [focusedDraft, setFocusedDraft] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date(Date.now()).toLocaleDateString('en-'));
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);

  const onDismissCalendarModal = () => setIsCalendarModalVisible(false);

  const onScheduleDraft = (draft) => {
    setFocusedDraft(draft);
    setIsCalendarModalVisible(true);
  };

  const onSetBackgroundTask = ({ draft, date }) => {
    // TODO: set background task with draft.
    console.log({ draft, date });
  };

  function renderDraft({ item: draft }) {
    return (
      <Draft
        draft={draft}
        onEdit={onEditDraft}
        onDelete={onDeleteDraft}
        onSchedule={onScheduleDraft}
      />
    );
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
      <Portal>
        <Modal
          visible={isCalendarModalVisible}
          onDismiss={onDismissCalendarModal}
          contentContainerStyle={DraftStyles(theme).calendarModal}
        >
          <View style={DraftStyles(theme).calendarWrapper}>
            <Calendar
              style={DraftStyles(theme).calendar}
              current={currentDate}
              markedDates={{ [currentDate]: { selected: true } }}
              onDayPress={(day) => setCurrentDate(day.dateString)}
            />
            <Button onPress={() => onSetBackgroundTask({ draft: focusedDraft, date: currentDate })}>
              Post at Date
            </Button>
          </View>
        </Modal>
      </Portal>
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
