import React from 'react';
import PropTypes from 'prop-types';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'react-native-paper';
import PickerStyles from '../styles/picker';

export default function SearchInPicker({ value, onChange }) {
  const theme = useTheme();

  return (
    <Picker selectedValue={value} onValueChange={onChange} style={PickerStyles(theme).picker}>
      <Picker.Item label="All" value="all" />
      <Picker.Item label="Friends" value="friends" />
    </Picker>
  );
}

SearchInPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
