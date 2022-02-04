import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import {
  Avatar, Headline, useTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfilePhoto, getUser } from '../helpers/requests';
import toDataUrl from '../helpers/blob';
import Divider from '../components/Divider';

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
    justifyContent: 'space-evenly',
  },
  nameDetail: {
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

export default function ProfilePage({ route }) {
  const { userId } = route.params;

  const theme = useTheme();

  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState('');

  /**
   * Gets the specified user's information.
   * @param {Object} userData Requested user data to get another user.
   * @param {string} sessionToken Logged in user's authorisation token.
   */
  async function loadUser({ sessionToken }) {
    const { ok, body } = await getUser({ userId, sessionToken });

    if (ok) {
      setUser(body);
    }
  }

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
    await loadUser({ sessionToken });
    await loadProfilePhoto({ sessionToken });
  }, []);

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).details}>
        <Avatar.Image
          size={128}
          theme={theme}
          source={{ uri: profilePhoto }}
        />
        <View style={styles(theme).nameDetail}>
          <Headline style={styles(theme).name}>{ user?.first_name }</Headline>
          <Headline style={styles(theme).name}>{ user?.last_name }</Headline>
        </View>
        <Divider text="Posts" />
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
