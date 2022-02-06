import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StyleSheet } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createPost,
  getProfilePhoto,
  getUser,
  getPosts,
  logout,
} from '../helpers/requests';
import toDataUrl from '../helpers/blob';
import capitalise from '../helpers/strings';
import PageStyles from '../styles/page';
import ProfileHero from '../components/ProfileHero';
import Divider from '../components/Divider';
import PostCompose from '../components/PostCompose';
import Post from '../components/Post';

const styles = StyleSheet.create({
  spacing: {
    gap: 16,
  },
  postList: {
    paddingHorizontal: 16,
  },
  postListContent: {
    gap: 16,
    paddingBottom: 16,
  },
});

export default function ProfilePage({ route }) {
  const { userId, onUnauthenticate } = route.params;

  const theme = useTheme();

  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [posts, setPosts] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  /**
   * Gets the specified user's information.
   * @param {Object} userData Requested user data to get another user.
   * @param {string} userData.sessionToken Logged in user's authorisation token.
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
   * @param {string} userData.sessionToken Logged in user's authorisation token.
   */
  async function loadProfilePhoto({ sessionToken }) {
    const { ok, body } = await getProfilePhoto({ userId, sessionToken });

    if (ok) {
      setProfilePhoto(await toDataUrl(body));
    }
  }

  /**
   * Gets the posts on the user's profile.
   * @param {Object} userData Requested user data to get another user.
   * @param {string} userData.sessionToken Logged in user's authorisation token.
   */
  async function loadPosts({ sessionToken }) {
    const { ok, body } = await getPosts({ userId, sessionToken });

    if (ok) {
      setPosts(body);
    }
  }

  useEffect(async () => {
    const sessionToken = await AsyncStorage.getItem('session_token');
    await loadUser({ sessionToken });
    await loadProfilePhoto({ sessionToken });
    await loadPosts({ sessionToken });
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

  const onEditProfile = () => console.log('editing profile...');

  /**
   * Handles logging out the current user and returning to `login` screen.
   */
  const onLogout = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await logout({ sessionToken });

      if (response.ok) {
        return onUnauthenticate();
      }

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to reach server.');
    }
  };

  /**
   * Handles creating a new post in the system.
   * @param {Object} data Post data.
   * @param {string} text Text content of a post.
   */
  const onPost = async ({ text }) => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const response = await createPost({ userId, sessionToken, text });

      // Reload state with new post.
      await loadPosts({ sessionToken });

      return showSnackbar(response.message);
    } catch (err) {
      return showSnackbar('failed to reach server.');
    }
  };

  const onLike = ({ post }) => console.log('liked post ', post);

  const renderPosts = ({ item: post }) => <Post post={post} onLike={onLike} />;

  return (
    <View style={[PageStyles(theme).page, styles.spacing]}>
      <ProfileHero
        profilePhoto={profilePhoto}
        user={user}
        onEdit={onEditProfile}
        onLogout={onLogout}
      />
      <Divider text="Posts" />
      <FlatList
        style={styles.postList}
        contentContainerStyle={styles.postListContent}
        data={posts}
        ListHeaderComponent={<PostCompose onPost={onPost} />}
        renderItem={renderPosts}
        keyExtractor={(item) => item.postId}
      />
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
      onUnauthenticate: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
