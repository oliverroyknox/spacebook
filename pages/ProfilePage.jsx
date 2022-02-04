import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPost, getProfilePhoto, getUser } from '../helpers/requests';
import toDataUrl from '../helpers/blob';
import capitalise from '../helpers/strings';
import PageStyles from '../styles/page';
import ProfileHero from '../components/ProfileHero';
import Divider from '../components/Divider';
import PostCompose from '../components/PostCompose';

const styles = StyleSheet.create({
  spacing: {
    gap: 16,
  },
  posts: {
    height: '100%',
    paddingHorizontal: 16,
  },
});

export default function ProfilePage({ route }) {
  const { userId } = route.params;

  const theme = useTheme();

  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

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

  /**
   * Synchronises state when `Snackbar` is dismissed.
   */
  const onDismissSnackbar = () => setIsSnackbarVisible(false);

  /**
   * Shows a `Snackbar` with the given message.
   * @param {string} message Message to display in `Snackbar`.
   */
  function showSnackbar(message) {
    setSnackbarMessage(capitalise(message));
    return setIsSnackbarVisible(true);
  }

  /**
   * Handles creating a new post in the system.
   * @param {Object} data Post data.
   * @param {string} text Text content of a post.
   */
  const onPost = async ({ text }) => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await createPost({ userId, sessionToken, text });

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to reach server');
    }
  };

  return (
    <View style={[PageStyles(theme).page, styles.spacing]}>
      <ProfileHero profilePhoto={profilePhoto} user={user} />
      <Divider text="Posts" />
      <View style={styles.posts}>
        <PostCompose onPost={onPost} />
      </View>
      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
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
