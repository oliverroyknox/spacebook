import { StyleSheet } from 'react-native';

const styles = ({ colors }) =>
  StyleSheet.create({
    caption: {
      color: colors.error,
      minHeight: 20,
    },
  });

export default styles;
