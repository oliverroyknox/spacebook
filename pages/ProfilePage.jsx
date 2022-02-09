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
  updateUser,
  getPosts,
  logout,
  getPost,
  likePost,
  unlikePost,
  updatePost,
  deletePost,
  uploadProfilePhoto,
} from '../helpers/requests';
import { toDataUrl, fetchFromUri } from '../helpers/blob';
import capitalise from '../helpers/strings';
import PageStyles from '../styles/page';
import ProfileHero from '../components/ProfileHero';
import ProfileEditModal from '../components/ProfileEditModal';
import Divider from '../components/Divider';
import PostCompose from '../components/PostCompose';
import Post from '../components/Post';
import PostEdit from '../components/PostEdit';
import PostDeleteDialog from '../components/PostDeleteDialog';

const styles = StyleSheet.create({
  spacing: {
    marginVertical: 8,
  },
  postList: {
    paddingHorizontal: 16,
  },
  postContent: {
    marginBottom: 8,
  },
  post: {
    marginVertical: 8,
  },
  modalContent: {
    marginHorizontal: 16,
  },
});

export default function ProfilePage({ route, onUnauthenticate }) {
  const { userId } = route.params;

  const theme = useTheme();

  const [signedInUserId, setSignedInUserId] = useState(-1);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [posts, setPosts] = useState([]);
  const [focusedPost, setFocusedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
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

    return () => {
      setUser(null);
      setProfilePhoto('');
      setPosts([]);
      setSignedInUserId(-1);
    };
  }, []);

  /**
   * Synchronises state when `PostDeleteDialog` is dismissed.
   */
  const onDismissDialog = () => {
    setIsDialogVisible(false);

    if (deletingPost) setDeletingPost(null);
  };

  /**
   * Synchronises state when `ProfileEditModal` is dismissed.
   */
  const onDismissProfileModal = () => setIsProfileModalVisible(false);

  /**
   * Synchronises state when `Modal` is dismissed.
   */
  const onDismissPostModal = () => {
    setIsPostModalVisible(false);

    if (focusedPost) setFocusedPost(null);
    if (editingPost) setEditingPost(null);
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
      setIsPostModalVisible(true);
      return setFocusedPost(response.body);
    }

    return showSnackbar(response.message);
  };

  /**
   * Shows a `Modal` with a post ready to be edited.
   * @param {Object} data Callback data.
   * @param {Object} data.post A post to be edited.
   */
  const onShowEditPostModal = ({ post }) => {
    // Cleanup any existing `Modals` before loading this one.
    // As this `Modal` can be triggered from another.
    onDismissPostModal();

    setEditingPost(post);
    setIsPostModalVisible(true);
  };

  /**
   * Shows the `PostDeleteDialog` to confirm deletion.
   * @param {Object} data Callback data.
   * @param {Object} data.post The post to target for deletion.
   */
  const onShowDeleteDialog = ({ post }) => {
    // Cleanup any existing `Modals` before loading this one.
    // As this `Modal` can be triggered from another.
    onDismissPostModal();

    setIsDialogVisible(true);
    setDeletingPost(post);
  };

  /**
   * Handles starting a session to edit a profile.
   */
  const onEditProfile = () => setIsProfileModalVisible(true);

  /**
   * Handles saving changes to a profile.
   * @param {Object} data Callback data.
   * @param {string} data.firstName First name of user.
   * @param {string} data.lastName Last name of user.
   */
  const onSaveProfile = async ({
    firstName,
    lastName,
    profilePhoto: photo,
  }) => {
    onDismissProfileModal();

    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      const data = { firstName, lastName };
      const updateUserResponse = await updateUser({ userId, sessionToken, user: data });

      if (updateUserResponse.ok) {
        await loadPosts({ sessionToken });
        await loadUser({ sessionToken });

        if (!photo) return null;

        const blob = await fetchFromUri(photo);
        const uploadPhotoResponse = await uploadProfilePhoto({
          userId,
          sessionToken,
          photo: blob,
        });

        if (uploadPhotoResponse.ok) {
          return loadProfilePhoto({ sessionToken });
        }

        return showSnackbar(uploadPhotoResponse.message);
      }

      return showSnackbar(updateUserResponse.message);
    } catch (err) {
      return showSnackbar('failed to reach server.');
    }
  };

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

  /**
   * Handles saving the changes made from an edit post interaction.
   * @param {Object} data Data from callback.
   * @param {string} data.text New text of post to update.
   */
  const onEditPost = async ({ postId, text }) => {
    // Cleanup any existing `Modals` before loading this one.
    // As this `Modal` can be triggered from another.
    onDismissPostModal();

    const data = { text };
    const sessionToken = await AsyncStorage.getItem('session_token');
    const response = await updatePost({
      userId,
      postId,
      sessionToken,
      post: data,
    });

    if (response.ok) {
      return loadPosts({ sessionToken });
    }

    return showSnackbar(response.message);
  };

  /**
   * Handles deleting a post.
   * @param {Object} data Data from callback.
   * @param {string} data.postId ID of post to delete.
   */
  const onDeletePost = async ({ postId }) => {
    onDismissDialog();

    const sessionToken = await AsyncStorage.getItem('session_token');
    const response = await deletePost({ userId, postId, sessionToken });

    if (response.ok) {
      return loadPosts({ sessionToken });
    }

    return showSnackbar(response.message);
  };

  /**
   * Conditionally render a `Post` component.
   */
  const renderPost = ({ item: post }, options) => {
    const isLikeable = userId !== signedInUserId && post.author.userId !== signedInUserId;
    const isOwn = post.author.userId === signedInUserId;
    const isFocused = Boolean(options?.isFocused);

    const style = !isFocused && styles.post;

    function renderCard() {
      // According to API spec.
      // If Post is authored by the currently signed in user it cannot be liked,
      // but can be edited / deleted.
      if (isOwn) {
        return (
          <Post
            post={post}
            onEdit={onShowEditPostModal}
            onDelete={onShowDeleteDialog}
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
      return (
        <Post post={post} onPress={onShowPostModal} isFocused={isFocused} />
      );
    }

    return <View style={style}>{renderCard()}</View>;
  };

  return (
    <View style={[PageStyles(theme).page]}>
      <ProfileHero
        profilePhoto={profilePhoto}
        user={user}
        onEdit={onEditProfile}
        onLogout={onLogout}
      />
      <View style={styles.spacing}>
        <Divider text="Posts" />
      </View>
      <FlatList
        style={[styles.postList]}
        contentContainerStyle={styles.postContent}
        data={posts}
        ListHeaderComponent={<PostCompose onPost={onPost} />}
        ListHeaderComponentStyle={styles.postContent}
        renderItem={renderPost}
        keyExtractor={(item) => item.postId}
      />
      <Portal>
        {user && (
          <ProfileEditModal
            profilePhoto={profilePhoto}
            user={user}
            visible={isProfileModalVisible}
            onDismiss={onDismissProfileModal}
            onSave={onSaveProfile}
          />
        )}
      </Portal>
      <Portal>
        <Modal
          visible={isPostModalVisible}
          onDismiss={onDismissPostModal}
          contentContainerStyle={styles.modalContent}
        >
          {focusedPost
            && renderPost({ item: focusedPost }, { isFocused: true })}
          {editingPost && <PostEdit post={editingPost} onSave={onEditPost} />}
        </Modal>
      </Portal>
      <Portal>
        {deletingPost && (
          <PostDeleteDialog
            post={deletingPost}
            visible={isDialogVisible}
            onDismiss={onDismissDialog}
            onDelete={onDeletePost}
          />
        )}
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
    }).isRequired,
  }).isRequired,
  onUnauthenticate: PropTypes.func.isRequired,
};
