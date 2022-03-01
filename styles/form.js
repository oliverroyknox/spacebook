import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 32,
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    marginVertical: 16,
  },
  item: {
    marginVertical: 8,
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: 'auto',
  },
  icon: {
    marginRight: 8,
  },
  signup: {
    marginBottom: 24,
  },
});

export default styles;
