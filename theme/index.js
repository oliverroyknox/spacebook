import { DefaultTheme } from 'react-native-paper';
import Colors from './colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors,
  },
};

export default theme;
