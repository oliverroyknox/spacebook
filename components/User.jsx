import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'react-native-paper';

const renderListIconRight = ({ color, style }) => (
  <List.Icon color={color} style={style} icon="chevron-forward" />
);

export default function User({ userId, firstName, lastName, onGoToUser }) {
  return (
    <List.Item
      key={userId}
      title={`${firstName} ${lastName}`}
      onPress={() => onGoToUser({ userId })}
      right={renderListIconRight}
    />
  );
}

User.propTypes = {
  userId: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  onGoToUser: PropTypes.func.isRequired,
};
