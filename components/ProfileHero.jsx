import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Avatar, Headline, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    height: '30%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    paddingBottom: 0,
  },
  nameContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  name: {
    fontSize: 28,
  },
});

export default function ProfileHero({ profilePhoto, user }) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Avatar.Image size={128} theme={theme} source={{ uri: profilePhoto }} />
      <View style={styles.nameContainer}>
        <Headline style={styles.name}>{user?.firstName}</Headline>
        <Headline style={styles.name}>{user?.lastName}</Headline>
      </View>
    </View>
  );
}

ProfileHero.propTypes = {
  profilePhoto: PropTypes.string.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }),
};

ProfileHero.defaultProps = {
  user: {
    firstName: '',
    lastName: '',
  },
};
