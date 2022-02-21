import React from 'react';
import PropTypes from 'prop-types';
import { TextInput as Input } from 'react-native-paper';
import { Controller } from 'react-hook-form';

export default function TextInput({ control, name, label, secureTextEntry }) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, onBlur, value } }) => (
				<Input onBlur={onBlur} onChangeText={onChange} value={value} mode="outlined" label={label} secureTextEntry={secureTextEntry} />
			)}
		/>
	);
}

TextInput.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	control: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	secureTextEntry: PropTypes.bool,
};

TextInput.defaultProps = {
	secureTextEntry: false,
};
