import { StyleSheet } from 'react-native';

const styles = ({ colors }) =>
  StyleSheet.create({
    modal: {
      backgroundColor: colors.page,
      flex: 2 / 3,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      marginHorizontal: 16,
    },
    calendarModal: {
      padding: 16,
      marginHorizontal: 16,
    },
    calendarWrapper: {
      backgroundColor: colors.page,
      padding: 16,
    },
    calendar: {
      padding: 16,
    },
    list: {
      width: '100%',
    },
    card: {
      flex: 1,
      marginVertical: 8,
    },
    text: {
      flex: 1,
      flexWrap: 'wrap',
    },
  });

export default styles;
