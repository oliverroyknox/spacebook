import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Image, View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfilePhoto } from '../helpers/requests';
import toDataUrl from '../helpers/blob';

const styles = ({ colors }) => StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    backgroundColor: colors.page,
  },
  details: {
    height: '33%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function ProfilePage({ route }) {
  const { userId } = route.params;

  const theme = useTheme();

  const [profilePhoto, setProfilePhoto] = useState('');

  /**
   * Gets the user's profile photo and set it's data URL to state.
   * @param {Object} userData Required user data to get profile photo.
   * @param {string} sessionToken Logged in user's authorisation token.
   */
  async function loadProfilePhoto({ sessionToken }) {
    const { ok, body } = await getProfilePhoto({ userId, sessionToken });

    if (ok) {
      setProfilePhoto(await toDataUrl(body));
    }
  }

  useEffect(async () => {
    const sessionToken = await AsyncStorage.getItem('session_token');
    await loadProfilePhoto({ userId, sessionToken });
  }, []);

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).details}>
        <Image
          style={{ width: 128, height: 128 }}
          source={{ uri: profilePhoto }}
        />
      </View>
    </View>
  );
}

ProfilePage.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
