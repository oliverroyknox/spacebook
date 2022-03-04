import React from 'react';
import PropTypes from 'prop-types';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'react-native-paper';
import PickerStyles from '../styles/picker';

export default function LimitPicker({ value, onChange }) {
  const theme = useTheme();

  return (
    <Picker selectedValue={value} onValueChange={onChange} style={PickerStyles(theme).picker}>
      <Picker.Item label="5" value={5} />
      <Picker.Item label="10" value={10} />
      <Picker.Item label="20" value={20} />
    </Picker>
  );
}

LimitPicker.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
