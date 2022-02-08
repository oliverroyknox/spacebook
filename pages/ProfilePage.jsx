import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Portal, Modal, Snackbar, useTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createPost,
  getProfilePhoto,
  getUser,
  getPosts,
  logout,
  getPost,
  likePost,
  unlikePost,
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
  modalContent: {
    marginHorizontal: 32,
  },
});

export default function ProfilePage({ route }) {
  const { userId, onUnauthenticate } = route.params;

  const theme = useTheme();

  const [signedInUserId, setSignedInUserId] = useState(-1);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [posts, setPosts] = useState([]);
  const [focusedPost, setFocusedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

    setSignedInUserId(Number(await AsyncStorage.getItem('user_id')));
  }, []);

  /**
   * Synchronises state when `Modal` is dismissed.
   */
  const onDismissModal = () => {
    setIsModalVisible(false);

    if (focusedPost) setFocusedPost(null);
  };

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
   * Shows a `Modal` to display a post.
   * @param {Object} data Callback data.
   * @param {Object} data.post A focused post to show in the `Modal`.
   * @param {number} data.post.postId The ID of the focused post.
   */
  const onShowPostModal = async ({ post: { postId } }) => {
    const sessionToken = await AsyncStorage.getItem('session_token');
    const response = await getPost({ userId, postId, sessionToken });

    if (response.ok) {
      setIsModalVisible(true);
      return setFocusedPost(response.body);
    }

    return showSnackbar(response.message);
  };

  /**
   * Handles starting a session to edit a profile.
   */
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

  /**
   * Handles liking and unliking a post.
   * @param {Object} data Data from callback.
   * @param {Object} post Post that was liked.
   * @param {string} post.postId ID of post that was liked.
   */
  const onLikePost = async ({ post: { postId } }) => {
    const sessionToken = await AsyncStorage.getItem('session_token');
    const likeResponse = await likePost({ userId, postId, sessionToken });

    if (!likeResponse.ok && likeResponse.body?.isAlreadyLiked === true) {
      // If already liked then try an unlike post.
      const unlikeResponse = await unlikePost({ userId, postId, sessionToken });

      if (!unlikeResponse.ok) {
        return showSnackbar(unlikeResponse.message);
      }
    } else {
      return showSnackbar(likeResponse.message);
    }

    return loadPosts({ sessionToken });
  };

  const onEditPost = ({ post }) => {
    console.log({ post }, 'to edit.');
  };

  const onDeletePost = ({ post }) => {
    console.log({ post }, ' to delete.');
  };

  /**
   * Conditionally render a `Post` component.
   */
  const renderPost = ({ item: post }, options) => {
    const isLikeable = (userId !== signedInUserId) && (post.author.userId !== signedInUserId);
    const isOwn = post.author.userId === signedInUserId;
    const isFocused = Boolean(options?.isFocused);

    // According to API spec.
    // If Post is authored by the currently signed in user it cannot be liked,
    // but can be edited / deleted.
    if (isOwn) {
      return (
        <Post
          post={post}
          onEdit={onEditPost}
          onDelete={onDeletePost}
          onPress={onShowPostModal}
          isFocused={isFocused}
        />
      );
    }

    // According to API spec.
    // If Post is by a different user and not on the currently signed in user's profile,
    // it can be liked.
    if (isLikeable) {
      return (
        <Post
          post={post}
          onLike={onLikePost}
          onPress={onShowPostModal}
          isFocused={isFocused}
        />
      );
    }

    // Fallback post to render "something", if above conditions fail to meet requirements.
    return <Post post={post} onPress={onShowPostModal} isFocused={isFocused} />;
  };

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
        renderItem={renderPost}
        keyExtractor={(item) => item.postId}
      />
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={onDismissModal}
          contentContainerStyle={styles.modalContent}
        >
          {focusedPost
            && renderPost({ item: focusedPost }, { isFocused: true })}
        </Modal>
      </Portal>
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
